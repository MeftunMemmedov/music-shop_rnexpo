import { OrderItem } from '@/types';
import { db } from './db';

const MAX_ORDERS_LIMIT = 30;

export const initOrderDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY NOT NULL,
      status TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  `);
};

export const trimOrdersDB = (limit: number = MAX_ORDERS_LIMIT) => {
  db.runSync(
    `DELETE FROM orders 
     WHERE id NOT IN (
       SELECT id FROM orders 
       ORDER BY created_at DESC 
       LIMIT ?
     )`,
    [limit],
  );
};

export const saveOrdersToDB = (orders: OrderItem[]) => {
  if (!orders || orders.length === 0) return;

  const timestamp = Date.now();

  db.withTransactionSync(() => {
    for (const order of orders) {
      const createdAtTimestamp = new Date(order.created_at).getTime();

      db.runSync(
        `INSERT INTO orders (id, status, created_at, data, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           status = excluded.status,
           created_at = excluded.created_at,
           data = excluded.data,
           updated_at = excluded.updated_at`,
        [
          order.id,
          order.status,
          isNaN(createdAtTimestamp) ? timestamp : createdAtTimestamp,
          JSON.stringify(order),
          timestamp,
        ],
      );
    }
  });

  trimOrdersDB(MAX_ORDERS_LIMIT);
};

export const getLocalOrders = (status: string | 'all'): OrderItem[] => {
  const query =
    status === 'all'
      ? `SELECT data FROM orders ORDER BY created_at DESC`
      : `SELECT data FROM orders WHERE status = ? ORDER BY created_at DESC`;

  const params = status === 'all' ? [] : [status];
  const rows = db.getAllSync<{ data: string }>(query, params);

  return rows.map((row) => {
    const parsed = JSON.parse(row.data) as OrderItem;
    return {
      ...parsed,
      created_at: new Date(parsed.created_at), // String gelen tarihi tekrar Date nesnesine dönüştürüyoruz
    };
  });
};

export const getLocalOrderById = (id: string): OrderItem | null => {
  const row = db.getFirstSync<{ data: string }>(
    `SELECT data FROM orders WHERE id = ?`,
    [id],
  );

  if (!row) return null;

  const parsed = JSON.parse(row.data) as OrderItem;
  return {
    ...parsed,
    created_at: new Date(parsed.created_at),
  };
};

export const clearLocalOrders = () => {
  db.runSync('DELETE FROM orders');
};

// import { Order, OrderItem } from '@/types';
// import { db } from './db';

// const MAX_ORDERS_LIMIT = 30;

// export const initOrderDB = () => {
//   db.execSync(`
//     CREATE TABLE IF NOT EXISTS orders (
//       id TEXT PRIMARY KEY NOT NULL,
//       status TEXT NOT NULL,
//       created_at INTEGER NOT NULL,
//       data TEXT NOT NULL,
//       updated_at INTEGER NOT NULL
//     );
//   `);
// };

// export const trimOrdersDB = (limit: number = MAX_ORDERS_LIMIT) => {
//   db.runSync(
//     `DELETE FROM orders
//      WHERE id NOT IN (
//        SELECT id FROM orders
//        ORDER BY created_at DESC
//        LIMIT ?
//      )`,
//     [limit],
//   );
// };

// export const saveOrdersToDB = (orders: OrderItem[]) => {
//   if (!orders || orders.length === 0) return;

//   const timestamp = Date.now();

//   db.withTransactionSync(() => {
//     for (const order of orders) {
//       db.runSync(
//         `INSERT INTO orders (id, status, created_at, data, updated_at)
//          VALUES (?, ?, ?, ?, ?)
//          ON CONFLICT(id) DO UPDATE SET
//            status = excluded.status,
//            created_at = excluded.created_at,
//            data = excluded.data,
//            updated_at = excluded.updated_at`,
//         [
//           order.id,
//           order.status,
//           new Date(order.created_at).getTime(),
//           JSON.stringify(order),
//           timestamp,
//         ],
//       );
//     }
//   });

//   trimOrdersDB(MAX_ORDERS_LIMIT);
// };

// export const getLocalOrders = (status: string | 'all'): OrderItem[] => {
//   const query =
//     status === 'all'
//       ? `SELECT data FROM orders ORDER BY created_at DESC`
//       : `SELECT data FROM orders WHERE status = ? ORDER BY created_at DESC`;

//   const params = status === 'all' ? [] : [status];
//   const rows = db.getAllSync<{ data: string }>(query, params);

//   return rows.map((row) => JSON.parse(row.data));
// };

// export const getLocalOrderById = (id: string): OrderItem | null => {
//   const row = db.getFirstSync<{ data: string }>(
//     `SELECT data FROM orders WHERE id = ?`,
//     [id],
//   );

//   return row ? JSON.parse(row.data) : null;
// };

// export const clearLocalOrders = () => {
//   db.runSync('DELETE FROM orders');
// };
