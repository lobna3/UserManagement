import { configureStore } from '@reduxjs/toolkit'; // Import configureStore
import { composeWithDevTools } from '@redux-devtools/extension'; // Redux DevTools extension

// Import your rootReducer
import rootReducer from './reducers/root.reducer';

// Configure the store using Redux Toolkit's configureStore
const store = configureStore({
  reducer: rootReducer, // Pass the rootReducer to combine reducers
  devTools: composeWithDevTools(), // Enable Redux DevTools
});

export default store; // Export the store for use in your app

