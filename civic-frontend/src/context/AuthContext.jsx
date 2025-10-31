import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      
      // If user exists, ensure citizen profile exists
      if (session?.user) {
        try {
          const { data: existingProfile, error: profileCheckError } = await supabase
            .from('citizens')
            .select('*')
            .eq('citizen_id', session.user.id)
            .single()
          
          // If profile doesn't exist, create it
          if (profileCheckError && profileCheckError.code === 'PGRST116') {
            const metadata = session.user.user_metadata || {}
            await supabase.from('citizens').insert([{
              citizen_id: session.user.id,
              name: metadata.name || session.user.email.split('@')[0],
              email: session.user.email,
              ward: metadata.ward || 'Ward 1'
            }])
            console.log('Created citizen profile for existing session:', session.user.id)
          }
        } catch (profileError) {
          console.error('Error checking/creating citizen profile:', profileError)
        }
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin
      }
    })
    if (error) throw error
    
    // If user is created and confirmed, create citizen profile
    if (data.user && data.user.confirmed_at) {
      try {
        await supabase.from('citizens').insert([{
          citizen_id: data.user.id,
          name: metadata.name,
          email: email,
          ward: metadata.ward
        }])
      } catch (profileError) {
        console.error('Error creating citizen profile:', profileError)
      }
    }
    
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    setUser(data.user)
    
    // Check if citizen profile exists, if not create it
    if (data.user) {
      try {
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('citizens')
          .select('*')
          .eq('citizen_id', data.user.id)
          .single()
        
        // If profile doesn't exist, create it
        if (profileCheckError && profileCheckError.code === 'PGRST116') {
          const metadata = data.user.user_metadata || {}
          await supabase.from('citizens').insert([{
            citizen_id: data.user.id,
            name: metadata.name || data.user.email.split('@')[0],
            email: data.user.email,
            ward: metadata.ward || 'Ward 1'
          }])
          console.log('Created citizen profile for user:', data.user.id)
        }
      } catch (profileError) {
        console.error('Error checking/creating citizen profile:', profileError)
      }
    }
    
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}