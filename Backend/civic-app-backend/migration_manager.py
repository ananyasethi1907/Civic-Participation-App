import os
import glob
from database import get_supabase_client
from datetime import datetime

class MigrationManager:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.migrations_dir = "migrations"
    
    def create_migrations_table(self):
        """Create migrations tracking table"""
        sql = """
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version VARCHAR(10) PRIMARY KEY,
            description TEXT,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
        try:
            self.supabase.rpc('exec_sql', {'sql': sql}).execute()
            print("✅ Migrations table created")
        except Exception as e:
            print(f"❌ Failed to create migrations table: {e}")
    
    def get_applied_migrations(self):
        """Get list of applied migrations"""
        try:
            response = self.supabase.table("schema_migrations").select("version").execute()
            return [row["version"] for row in response.data]
        except:
            return []
    
    def get_pending_migrations(self):
        """Get list of pending migrations"""
        applied = self.get_applied_migrations()
        
        # Get all migration files
        migration_files = glob.glob(os.path.join(self.migrations_dir, "*.sql"))
        migration_files.sort()
        
        pending = []
        for file_path in migration_files:
            filename = os.path.basename(file_path)
            version = filename.split('_')[0]
            
            if version not in applied:
                pending.append({
                    'version': version,
                    'filename': filename,
                    'path': file_path
                })
        
        return pending
    
    def apply_migration(self, migration):
        """Apply a single migration"""
        try:
            # Read migration file
            with open(migration['path'], 'r') as f:
                sql_content = f.read()
            
            # Extract description from file
            description = "Migration applied"
            for line in sql_content.split('\n'):
                if line.startswith('-- Description:'):
                    description = line.replace('-- Description:', '').strip()
                    break
            
            # Execute migration
            self.supabase.rpc('exec_sql', {'sql': sql_content}).execute()
            
            # Record migration
            self.supabase.table("schema_migrations").insert({
                "version": migration['version'],
                "description": description
            }).execute()
            
            print(f"✅ Applied migration {migration['version']}: {description}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to apply migration {migration['version']}: {e}")
            return False
    
    def migrate(self):
        """Apply all pending migrations"""
        print("🔄 Checking for pending migrations...")
        
        # Ensure migrations table exists
        self.create_migrations_table()
        
        pending = self.get_pending_migrations()
        
        if not pending:
            print("✅ No pending migrations")
            return True
        
        print(f"📋 Found {len(pending)} pending migrations")
        
        success_count = 0
        for migration in pending:
            if self.apply_migration(migration):
                success_count += 1
            else:
                print(f"❌ Migration failed, stopping at {migration['version']}")
                break
        
        print(f"✅ Applied {success_count}/{len(pending)} migrations")
        return success_count == len(pending)
    
    def status(self):
        """Show migration status"""
        applied = self.get_applied_migrations()
        pending = self.get_pending_migrations()
        
        print("📊 Migration Status")
        print("=" * 40)
        print(f"Applied migrations: {len(applied)}")
        print(f"Pending migrations: {len(pending)}")
        
        if applied:
            print("\n✅ Applied:")
            for version in sorted(applied):
                print(f"  - {version}")
        
        if pending:
            print("\n⏳ Pending:")
            for migration in pending:
                print(f"  - {migration['version']}: {migration['filename']}")
    
    def create_migration(self, name):
        """Create a new migration file"""
        # Get next version number
        existing_files = glob.glob(os.path.join(self.migrations_dir, "*.sql"))
        if existing_files:
            versions = [int(os.path.basename(f).split('_')[0]) for f in existing_files]
            next_version = max(versions) + 1
        else:
            next_version = 1
        
        version_str = f"{next_version:03d}"
        filename = f"{version_str}_{name}.sql"
        filepath = os.path.join(self.migrations_dir, filename)
        
        template = f"""-- Migration: {filename}
-- Description: {name.replace('_', ' ').title()}
-- Created: {datetime.now().strftime('%Y-%m-%d')}
-- Author: System

-- Add your SQL here

"""
        
        with open(filepath, 'w') as f:
            f.write(template)
        
        print(f"✅ Created migration: {filepath}")
        return filepath

# CLI interface
if __name__ == "__main__":
    import sys
    
    manager = MigrationManager()
    
    if len(sys.argv) < 2:
        print("Usage: python migration_manager.py [migrate|status|create <name>]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "migrate":
        manager.migrate()
    elif command == "status":
        manager.status()
    elif command == "create" and len(sys.argv) > 2:
        name = sys.argv[2]
        manager.create_migration(name)
    else:
        print("Invalid command. Use: migrate, status, or create <name>")