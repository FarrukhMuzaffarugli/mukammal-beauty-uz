import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ordersApi } from '@/api/orders';
import { Order } from '@/types';

interface OrderState {
  items: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedOrder?: Order;
}

const initialState: OrderState = {
  items: [],
  status: 'idle'
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await ordersApi.myOrders();
  } catch (error) {
    return rejectWithValue('Failed to load orders');
  }
});

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await ordersApi.detail(orderId);
    } catch (error) {
      return rejectWithValue('Failed to load order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
      });
  }
});

export default orderSlice.reducer;
