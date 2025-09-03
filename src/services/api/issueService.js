import { toast } from "react-toastify";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const TABLE_NAME = "issue_c";

// Field mapping for database operations
const fieldMapping = {
  // Database field names for create/update operations (only Updateable fields)
  updateableFields: [
    'Name', 'Tags', 'title_c', 'description_c', 'status_c', 
    'priority_c', 'assignee_c', 'labels_c', 'created_at_c', 
    'updated_at_c', 'history_c'
  ]
};

// Data transformation utilities
const transformToDatabase = (data) => {
  const transformed = {};
  
  // Map mock field names to database field names
  if (data.title !== undefined) transformed.title_c = data.title;
  if (data.description !== undefined) transformed.description_c = data.description;
  if (data.status !== undefined) transformed.status_c = data.status;
  if (data.priority !== undefined) transformed.priority_c = data.priority;
  if (data.assignee !== undefined) transformed.assignee_c = data.assignee;
  if (data.labels !== undefined) {
    // Convert array to comma-separated string for MultiPicklist
    transformed.labels_c = Array.isArray(data.labels) ? data.labels.join(',') : data.labels;
  }
  if (data.createdAt !== undefined) transformed.created_at_c = data.createdAt;
  if (data.updatedAt !== undefined) transformed.updated_at_c = data.updatedAt;
  if (data.history !== undefined) {
    // Convert history array to multiline text
    transformed.history_c = Array.isArray(data.history) 
      ? data.history.map(h => `${h.timestamp}: ${h.action}${h.field ? ` - ${h.field}: ${h.oldValue} → ${h.newValue}` : ''}`).join('\n')
      : data.history;
  }
  
  // Include standard fields
  if (data.Name !== undefined) transformed.Name = data.Name;
  if (data.Tags !== undefined) transformed.Tags = data.Tags;
  
  return transformed;
};

const transformFromDatabase = (data) => {
  if (!data) return data;
  
  return {
    Id: data.Id,
    Name: data.Name,
    Tags: data.Tags,
    title: data.title_c || '',
    description: data.description_c || '',
    status: data.status_c || 'Open',
    priority: data.priority_c || 'Medium',
    assignee: data.assignee_c || '',
    labels: data.labels_c ? data.labels_c.split(',').map(l => l.trim()).filter(l => l) : [],
    createdAt: data.created_at_c || data.CreatedOn || new Date().toISOString(),
    updatedAt: data.updated_at_c || data.ModifiedOn || new Date().toISOString(),
    history: data.history_c ? data.history_c.split('\n').map(line => {
      const [timestamp, ...rest] = line.split(': ');
      return {
        timestamp,
        action: rest.join(': '),
        field: null,
        oldValue: null,
        newValue: null
      };
    }) : []
  };
};

export const issueService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "labels_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "history_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(transformFromDatabase);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching issues:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching issues:", error.message);
        toast.error("Failed to load issues");
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "labels_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "history_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };
      
      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Issue not found");
      }
      
      if (!response.data) {
        throw new Error("Issue not found");
      }
      
      return transformFromDatabase(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching issue with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error("Error fetching issue:", error.message);
      }
      throw error;
    }
  },

  async create(issueData) {
    try {
      const apperClient = getApperClient();
      
      // Transform data and only include updateable fields
      const transformedData = transformToDatabase(issueData);
      
      // Set default values and current timestamps
      const createData = {
        Name: transformedData.title_c || 'New Issue',
        title_c: transformedData.title_c || '',
        description_c: transformedData.description_c || '',
        status_c: transformedData.status_c || 'Open',
        priority_c: transformedData.priority_c || 'Medium',
        assignee_c: transformedData.assignee_c || '',
        labels_c: transformedData.labels_c || '',
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString(),
        history_c: `${new Date().toISOString()}: Issue created`
      };
      
      const params = {
        records: [createData]
      };
      
      const response = await apperClient.createRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create issue");
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create issue ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return transformFromDatabase(successfulRecords[0].data);
        }
      }
      
      throw new Error("Failed to create issue");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating issue:", error?.response?.data?.message);
      } else {
        console.error("Error creating issue:", error.message);
      }
      throw error;
    }
  },

  async update(id, issueData) {
    try {
      const apperClient = getApperClient();
      
      // Transform data and only include updateable fields
      const transformedData = transformToDatabase(issueData);
      
      const updateData = {
        Id: parseInt(id),
        updated_at_c: new Date().toISOString(),
        ...transformedData
      };
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update issue");
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update issue ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return transformFromDatabase(successfulUpdates[0].data);
        }
      }
      
      throw new Error("Failed to update issue");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating issue:", error?.response?.data?.message);
      } else {
        console.error("Error updating issue:", error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to delete issue");
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete issue ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return { success: successfulDeletions.length > 0 };
      }
      
      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting issue:", error?.response?.data?.message);
      } else {
        console.error("Error deleting issue:", error.message);
      }
      throw error;
    }
  },

  // Additional utility methods using fetchRecords
  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "labels_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "history_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      console.error("Error fetching issues by status:", error);
      return [];
    }
  },

  async getByPriority(priority) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "labels_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "history_c" } }
        ],
        where: [
          {
            FieldName: "priority_c",
            Operator: "EqualTo",
            Values: [priority]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      console.error("Error fetching issues by priority:", error);
      return [];
    }
  },

  async getByAssignee(assignee) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "labels_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "history_c" } }
        ],
        where: [
          {
            FieldName: "assignee_c",
            Operator: "EqualTo",
            Values: [assignee]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      console.error("Error fetching issues by assignee:", error);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "labels_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "history_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
                    operator: "Contains", 
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "labels_c",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(transformFromDatabase);
    } catch (error) {
      console.error("Error searching issues:", error);
      return [];
    }
  }
};