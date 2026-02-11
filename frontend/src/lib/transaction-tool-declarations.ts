export const transactionTools = {
  functionDeclarations: [
    {
      name: "createTransaction",
      description:
        "Create a new income or expense transaction. Use this when the user wants to add a new transaction.",
      parameters: {
        type: "OBJECT",
        properties: {
          amount: {
            type: "NUMBER",
            description: "The transaction amount (must be positive)",
          },
          type: {
            type: "STRING",
            enum: ["INCOME", "EXPENSE"],
            description:
              "The type of transaction - INCOME for money received, EXPENSE for money spent",
          },
          categoryName: {
            type: "STRING",
            description:
              "The name of the category for this transaction (e.g., 'Food', 'Salary', 'Rent')",
          },
          description: {
            type: "STRING",
            description: "Optional description or note for the transaction",
          },
          date: {
            type: "STRING",
            description:
              "Optional date in ISO format (YYYY-MM-DD). If not provided, uses today's date",
          },
        },
        required: ["amount", "type", "categoryName"],
      },
    },
    {
      name: "updateTransaction",
      description:
        "Update an existing transaction. Use this when the user wants to modify a transaction.",
      parameters: {
        type: "OBJECT",
        properties: {
          id: {
            type: "STRING",
            description: "The unique ID of the transaction to update",
          },
          amount: {
            type: "NUMBER",
            description: "The new transaction amount",
          },
          type: {
            type: "STRING",
            enum: ["INCOME", "EXPENSE"],
            description: "The new transaction type",
          },
          categoryName: {
            type: "STRING",
            description: "The new category name",
          },
          description: {
            type: "STRING",
            description:
              "The new description (can be null to remove description)",
          },
          date: {
            type: "STRING",
            description: "The new date in ISO format (YYYY-MM-DD)",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "deleteTransaction",
      description:
        "Delete a transaction. Use this when the user wants to remove a transaction.",
      parameters: {
        type: "OBJECT",
        properties: {
          id: {
            type: "STRING",
            description: "The unique ID of the transaction to delete",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "getTransactions",
      description:
        "Get a list of transactions with optional filters. Use this when the user wants to view or search for transactions.",
      parameters: {
        type: "OBJECT",
        properties: {
          categoryId: {
            type: "STRING",
            description: "Filter by category ID",
          },
          type: {
            type: "STRING",
            enum: ["INCOME", "EXPENSE"],
            description: "Filter by transaction type",
          },
          startDate: {
            type: "STRING",
            description:
              "Filter transactions from this date (ISO format: YYYY-MM-DD)",
          },
          endDate: {
            type: "STRING",
            description:
              "Filter transactions until this date (ISO format: YYYY-MM-DD)",
          },
        },
        required: [],
      },
    },
    {
      name: "getTransactionOverview",
      description:
        "Get financial overview including total income, expenses, and balance. Use this when the user asks about their financial summary or balance.",
      parameters: {
        type: "OBJECT",
        properties: {
          categoryId: {
            type: "STRING",
            description: "Filter by category ID",
          },
          type: {
            type: "STRING",
            enum: ["INCOME", "EXPENSE"],
            description: "Filter by transaction type",
          },
          startDate: {
            type: "STRING",
            description: "Filter from this date (ISO format: YYYY-MM-DD)",
          },
          endDate: {
            type: "STRING",
            description: "Filter until this date (ISO format: YYYY-MM-DD)",
          },
        },
        required: [],
      },
    },
    {
      name: "getMonthlyFinancials",
      description:
        "Get monthly breakdown of income and expenses. Use this when the user asks about monthly trends or wants to see data by month.",
      parameters: {
        type: "OBJECT",
        properties: {
          categoryId: {
            type: "STRING",
            description: "Filter by category ID",
          },
          type: {
            type: "STRING",
            enum: ["INCOME", "EXPENSE"],
            description: "Filter by transaction type",
          },
          startDate: {
            type: "STRING",
            description: "Filter from this date (ISO format: YYYY-MM-DD)",
          },
          endDate: {
            type: "STRING",
            description: "Filter until this date (ISO format: YYYY-MM-DD)",
          },
        },
        required: [],
      },
    },
    {
      name: "getCategoryExpenses",
      description:
        "Get expenses broken down by category. Use this when the user wants to see spending by category or category analysis.",
      parameters: {
        type: "OBJECT",
        properties: {
          categoryId: {
            type: "STRING",
            description: "Filter by specific category ID",
          },
          startDate: {
            type: "STRING",
            description: "Filter from this date (ISO format: YYYY-MM-DD)",
          },
          endDate: {
            type: "STRING",
            description: "Filter until this date (ISO format: YYYY-MM-DD)",
          },
        },
        required: [],
      },
    },
    {
      name: "getCategories",
      description:
        "Get list of available transaction categories. Use this when the user wants to see what categories exist or needs to know category names.",
      parameters: {
        type: "OBJECT",
        properties: {
          categoryId: {
            type: "STRING",
            description: "Filter by specific category ID",
          },
          type: {
            type: "STRING",
            enum: ["INCOME", "EXPENSE"],
            description: "Filter categories by transaction type",
          },
          startDate: {
            type: "STRING",
            description: "Filter from this date (ISO format: YYYY-MM-DD)",
          },
          endDate: {
            type: "STRING",
            description: "Filter until this date (ISO format: YYYY-MM-DD)",
          },
        },
        required: [],
      },
    },
  ],
};
