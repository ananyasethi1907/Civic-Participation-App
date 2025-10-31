-- Enable Realtime for tables
-- Run this in Supabase SQL Editor

-- Enable realtime for issues table (for new issue reports)
ALTER PUBLICATION supabase_realtime ADD TABLE issues;

-- Enable realtime for notifications table (for status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable realtime for votes table (for live vote counts)
ALTER PUBLICATION supabase_realtime ADD TABLE votes;

-- Enable realtime for feedbacks table (for live comments)
ALTER PUBLICATION supabase_realtime ADD TABLE feedbacks;

-- Create function to notify citizens when issue status changes
CREATE OR REPLACE FUNCTION notify_issue_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for issue creator when status changes
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