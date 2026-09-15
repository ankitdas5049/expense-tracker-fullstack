import { initializeDatabase } from './db';
import { createUser } from './services/userService';
import { initializeDefaultCategories, createCategory } from './services/categoryService';
import { createExpense } from './services/expenseService';
import { createBudget } from './services/budgetService';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
  try {
    console.log('Starting database seed...');
    await initializeDatabase();
    console.log('Database initialized');

    // Create test users
    const studentUser = await createUser(
      'student@example.com',
      'password123',
      'Alex Student',
      'student'
    );
    console.log('Created student user:', studentUser.id);

    const professionalUser = await createUser(
      'professional@example.com',
      'password123',
      'Jordan Professional',
      'professional'
    );
    console.log('Created professional user:', professionalUser.id);

    // Initialize default categories for both users
    await initializeDefaultCategories(studentUser.id);
    await initializeDefaultCategories(professionalUser.id);
    console.log('Initialized default categories');

    // Seed expenses for student
    const studentExpenses = [
      { category: 'Food & Dining', amount: 15.50, description: 'Lunch at cafeteria', date: '2024-09-14' },
      { category: 'Transportation', amount: 12.00, description: 'Metro pass', date: '2024-09-13' },
      { category: 'Entertainment', amount: 25.00, description: 'Movie tickets', date: '2024-09-12' },
      { category: 'Food & Dining', amount: 8.75, description: 'Coffee', date: '2024-09-11' },
      { category: 'Shopping', amount: 45.00, description: 'Books for class', date: '2024-09-10' },
      { category: 'Education', amount: 120.00, description: 'Textbook', date: '2024-09-09' },
      { category: 'Health & Fitness', amount: 30.00, description: 'Gym membership', date: '2024-09-08' },
      { category: 'Personal Care', amount: 18.50, description: 'Haircut', date: '2024-09-07' },
      { category: 'Utilities', amount: 50.00, description: 'Internet bill', date: '2024-09-01' },
      { category: 'Food & Dining', amount: 22.00, description: 'Dinner with friends', date: '2024-08-30' },
    ];

    for (const exp of studentExpenses) {
      const categoryName = exp.category;
      const category = await getCategoryByName(studentUser.id, categoryName);
      if (category) {
        await createExpense(
          studentUser.id,
          category.id,
          exp.amount,
          exp.description,
          exp.date,
          ['cash', 'card', 'transfer'][Math.floor(Math.random() * 3)] as 'cash' | 'card' | 'transfer'
        );
      }
    }
    console.log('Seeded student expenses');

    // Seed expenses for professional
    const professionalExpenses = [
      { category: 'Food & Dining', amount: 45.00, description: 'Lunch meeting', date: '2024-09-14' },
      { category: 'Transportation', amount: 120.00, description: 'Fuel', date: '2024-09-13' },
      { category: 'Entertainment', amount: 85.00, description: 'Client dinner', date: '2024-09-12' },
      { category: 'Utilities', amount: 180.00, description: 'Electricity bill', date: '2024-09-11' },
      { category: 'Shopping', amount: 150.00, description: 'Office supplies', date: '2024-09-10' },
      { category: 'Health & Fitness', amount: 75.00, description: 'Gym subscription', date: '2024-09-09' },
      { category: 'Personal Care', amount: 120.00, description: 'Salon', date: '2024-09-08' },
      { category: 'Education', amount: 200.00, description: 'Online course', date: '2024-09-07' },
      { category: 'Food & Dining', amount: 65.00, description: 'Team lunch', date: '2024-09-06' },
      { category: 'Transportation', amount: 150.00, description: 'Taxi to airport', date: '2024-08-31' },
    ];

    for (const exp of professionalExpenses) {
      const categoryName = exp.category;
      const category = await getCategoryByName(professionalUser.id, categoryName);
      if (category) {
        await createExpense(
          professionalUser.id,
          category.id,
          exp.amount,
          exp.description,
          exp.date,
          ['cash', 'card', 'transfer'][Math.floor(Math.random() * 3)] as 'cash' | 'card' | 'transfer'
        );
      }
    }
    console.log('Seeded professional expenses');

    // Create budgets
    const studentCategories = await getCategoriesForUser(studentUser.id);
    for (const cat of studentCategories.slice(0, 4)) {
      await createBudget(studentUser.id, cat.id, 100, 'monthly');
    }
    console.log('Created student budgets');

    const professionalCategories = await getCategoriesForUser(professionalUser.id);
    for (const cat of professionalCategories.slice(0, 5)) {
      await createBudget(professionalUser.id, cat.id, 500, 'monthly');
    }
    console.log('Created professional budgets');

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Helper functions
const getCategoryByName = async (userId: string, name: string): Promise<any> => {
  const { get } = await import('./db');
  return get('SELECT * FROM categories WHERE user_id = ? AND name = ?', [userId, name]);
};

const getCategoriesForUser = async (userId: string): Promise<any[]> => {
  const { all } = await import('./db');
  return all('SELECT * FROM categories WHERE user_id = ? ORDER BY name', [userId]);
};

seed();
