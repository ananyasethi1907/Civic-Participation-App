-- Migration: 002_add_realtime.sql
-- Description: Enable realtime features and triggers
-- Created: 2024-01-02
-- Author: System

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE issues;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE feedbacks;

-- Create function to notify citizens when issue status changes
CREATE OR REPLACE FUNCTION notify_issue_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO notifications (citizen_id, message)
        VALUES (
            NEW.created_by,
            'Your issue "' || NEW.title || '" status changed to: ' || NEW.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for issue status changes
DROP TRIGGER IF EXISTS issue_status_change_trigger ON issues;
CREATE TRIGGER issue_status_change_trigger
    AFTER UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION notify_issue_status_change();