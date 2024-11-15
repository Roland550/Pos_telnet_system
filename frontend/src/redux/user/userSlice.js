import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  users: [],
  deleteUserError: null,
  deleteUserLoading: false,
  editing: false,

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.deleteUserLoading = true;
      state.deleteUserError = null;
    },
    deleteUserSuccess: (state, action) => {
      state.users = state.users.filter(
        (user) => user._id !== action.payload._id
      );
      state.deleteUserLoading = false;
      state.deleteUserError = null;
    },
    deleteUserFailed: (state, action) => {
      state.deleteUserLoading = false;
      state.deleteUserError = action.payload;
    },
    editUserStart: (state) => {
      state.editing = true;
      state.error = null;
    },
    editUserSuccess: (state, action) => {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
      state.editing = false;
      state.error = null;
    },
    editUserFailed: (state, action) => {
      state.editing = false;
      state.error = action.payload;
    },

  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logout,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
  editUserStart,
  editUserSuccess,
  editUserFailed,
} = userSlice.actions;
export default userSlice.reducer;
