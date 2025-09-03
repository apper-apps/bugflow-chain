import issuesData from "@/services/mockData/issues.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for issues (simulates database)
let issues = [...issuesData];

export const issueService = {
  async getAll() {
    await delay(300);
    return [...issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const issue = issues.find(issue => issue.Id === parseInt(id));
    if (!issue) {
      throw new Error("Issue not found");
    }
    return { ...issue };
  },

  async create(issueData) {
    await delay(400);
    
    // Find the highest existing Id and add 1
    const maxId = issues.reduce((max, issue) => Math.max(max, issue.Id), 0);
    
    const newIssue = {
      ...issueData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          timestamp: new Date().toISOString(),
          action: "Issue created",
          field: null,
          oldValue: null,
          newValue: null
        }
      ]
    };
    
    issues.unshift(newIssue);
    return { ...newIssue };
  },

  async update(id, issueData) {
    await delay(350);
    
    const index = issues.findIndex(issue => issue.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }

    const updatedIssue = {
      ...issueData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    issues[index] = updatedIssue;
    return { ...updatedIssue };
  },

  async delete(id) {
    await delay(300);
    
    const index = issues.findIndex(issue => issue.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Issue not found");
    }

    issues.splice(index, 1);
    return { success: true };
  },

  // Additional utility methods
  async getByStatus(status) {
    await delay(250);
    return issues.filter(issue => 
      issue.status.toLowerCase().replace(" ", "-") === status.toLowerCase()
    );
  },

  async getByPriority(priority) {
    await delay(250);
    return issues.filter(issue => 
      issue.priority.toLowerCase() === priority.toLowerCase()
    );
  },

  async getByAssignee(assignee) {
    await delay(250);
    return issues.filter(issue => issue.assignee === assignee);
  },

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return issues.filter(issue =>
      issue.title.toLowerCase().includes(searchTerm) ||
      issue.description.toLowerCase().includes(searchTerm) ||
      issue.Id.toString().includes(searchTerm) ||
      (issue.labels && issue.labels.some(label => 
        label.toLowerCase().includes(searchTerm)
      ))
    );
  }
};