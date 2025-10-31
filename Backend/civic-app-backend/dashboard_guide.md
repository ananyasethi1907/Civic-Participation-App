# Supabase Dashboard Guide

## 📊 Viewing Live Data in Supabase Dashboard

### 1. Access Your Dashboard
- Go to https://supabase.com/dashboard
- Select your project: `jxagtxkvvzwagrgplyno`

### 2. Table Editor
Navigate to **Table Editor** to view live data:

#### Citizens Table
- View all registered users
- Check email uniqueness
- Monitor user registration trends
- Filter by ward

#### Issues Table  
- See all reported issues in real-time
- Filter by status: Pending, In Progress, Resolved
- Sort by creation date
- View issue details and images

#### Votes Table
- Monitor voting activity
- Check vote counts per issue
- Identify most voted issues
- Prevent duplicate votes

#### Feedbacks Table
- View citizen comments on issues
- Track engagement levels
- Monitor feedback trends

#### Notifications Table
- See system notifications
- Check read/unread status
- Monitor notification delivery

### 3. Real-time Updates
Enable **Realtime** tab to see:
- New issues appearing instantly
- Status changes in real-time
- Vote counts updating live
- New feedback and notifications

### 4. SQL Editor
Use **SQL Editor** for:
- Custom queries
- Data analysis
- Migration execution
- Performance monitoring

#### Useful Queries:
```sql
-- Most reported issue categories
SELECT category, COUNT(*) as count 
FROM issues 
GROUP BY category 
ORDER BY count DESC;

-- Issues by status
SELECT status, COUNT(*) as count 
FROM issues 
GROUP BY status;

-- Most active citizens
SELECT c.name, COUNT(i.issue_id) as issues_reported
FROM citizens c
LEFT JOIN issues i ON c.citizen_id = i.created_by
GROUP BY c.citizen_id, c.name
ORDER BY issues_reported DESC;

-- Vote statistics
SELECT 
    i.title,
    COUNT(CASE WHEN v.vote_type = 'Upvote' THEN 1 END) as upvotes,
    COUNT(CASE WHEN v.vote_type = 'Downvote' THEN 1 END) as downvotes
FROM issues i
LEFT JOIN votes v ON i.issue_id = v.issue_id
GROUP BY i.issue_id, i.title
ORDER BY upvotes DESC;
```

### 5. Storage
View uploaded images in **Storage** → `issue_images`:
- Browse uploaded files
- Check file sizes
- Monitor storage usage
- View image URLs

### 6. Authentication
Monitor user activity in **Authentication**:
- View registered users
- Check login activity
- Monitor authentication events

### 7. Logs
Check **Logs** for:
- API requests
- Database queries
- Error tracking
- Performance metrics

## 🔍 Monitoring Best Practices

1. **Regular Data Checks**
   - Monitor table growth
   - Check for data quality issues
   - Verify foreign key relationships

2. **Performance Monitoring**
   - Watch query execution times
   - Monitor index usage
   - Check connection counts

3. **Security Monitoring**
   - Review authentication logs
   - Monitor failed login attempts
   - Check RLS policy effectiveness

4. **Storage Management**
   - Monitor storage usage
   - Clean up unused images
   - Optimize file sizes