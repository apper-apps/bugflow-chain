import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import IssueDetailPanel from "@/components/organisms/IssueDetailPanel";
import CreateIssueModal from "@/components/organisms/CreateIssueModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { issueService } from "@/services/api/issueService";

const BoardView = () => {
  const { filters } = useOutletContext();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadIssues = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await issueService.getAll();
      setIssues(data);
    } catch (err) {
      setError(err.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleCreateIssue = async (issueData) => {
    try {
      const newIssue = await issueService.create(issueData);
      setIssues(prev => [newIssue, ...prev]);
    } catch (err) {
      throw new Error(err.message || "Failed to create issue");
    }
  };

  const handleUpdateIssue = async (updatedIssue) => {
    try {
      const savedIssue = await issueService.update(updatedIssue.Id, updatedIssue);
      setIssues(prev => 
        prev.map(issue => issue.Id === savedIssue.Id ? savedIssue : issue)
      );
      setSelectedIssue(savedIssue);
    } catch (err) {
      throw new Error(err.message || "Failed to update issue");
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      await issueService.delete(issueId);
      setIssues(prev => prev.filter(issue => issue.Id !== issueId));
      setSelectedIssue(null);
    } catch (err) {
      throw new Error(err.message || "Failed to delete issue");
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const issue = issues.find(i => i.Id === issueId);
      if (!issue) return;

      const updatedIssue = {
        ...issue,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history: [
          ...(issue.history || []),
          {
            timestamp: new Date().toISOString(),
            action: "Status changed",
            field: "status",
            oldValue: issue.status,
            newValue: newStatus
          }
        ]
      };

      const savedIssue = await issueService.update(issueId, updatedIssue);
      setIssues(prev => 
        prev.map(issue => issue.Id === issueId ? savedIssue : issue)
      );
    } catch (err) {
      console.error("Failed to update issue status:", err);
    }
  };

  // Apply filters
  const filteredIssues = issues.filter(issue => {
    // Text search
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesTitle = issue.title?.toLowerCase().includes(searchLower);
      const matchesDescription = issue.description?.toLowerCase().includes(searchLower);
      const matchesId = issue.Id?.toString().includes(searchLower);
      if (!matchesTitle && !matchesDescription && !matchesId) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority?.length > 0) {
      if (!filters.priority.includes(issue.priority?.toLowerCase())) {
        return false;
      }
    }

    // Assignee filter
    if (filters.assignee?.length > 0) {
      if (!filters.assignee.includes(issue.assignee)) {
        return false;
      }
    }

    // Labels filter
    if (filters.labels?.length > 0) {
      const hasMatchingLabel = filters.labels.some(filterLabel =>
        issue.labels?.some(issueLabel => 
          issueLabel.toLowerCase() === filterLabel.toLowerCase()
        )
      );
      if (!hasMatchingLabel) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return <Loading type="board" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadIssues} />;
  }

  if (issues.length === 0) {
    return (
      <Empty
        title="No Issues Found"
        description="Get started by creating your first issue. Track bugs, features, and improvements all in one place."
        actionLabel="Create First Issue"
        onAction={() => setShowCreateModal(true)}
        icon="Bug"
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {filteredIssues.length === 0 && issues.length > 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Empty
            title="No Matching Issues"
            description="No issues match your current filters. Try adjusting your search criteria or clearing some filters."
            actionLabel="Create New Issue"
            onAction={() => setShowCreateModal(true)}
            icon="Search"
          />
        </div>
      ) : (
        <KanbanBoard
          issues={filteredIssues}
          onIssueClick={setSelectedIssue}
          onCreateIssue={() => setShowCreateModal(true)}
          onStatusChange={handleStatusChange}
        />
      )}

      <IssueDetailPanel
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onSave={handleUpdateIssue}
        onDelete={handleDeleteIssue}
      />

      <CreateIssueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateIssue}
      />
    </div>
  );
};

export default BoardView;