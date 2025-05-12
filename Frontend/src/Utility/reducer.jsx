import { type } from './action.type';

export const initialState = {
  basket: [],
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null
};

export const reducer = (state, action) => {
  switch (action.type) {
    case type.ADD_TO_BASKET:
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );
      if (!existingItem) {
        return {
          ...state,
          basket: [...state.basket, { ...action.item, amount: 1 }]
        };
      } else {
        const updateBasket = state.basket.map((item) => {
          return item.id === action.item.id
            ? { ...item, amount: item.amount + 1 }
            : item;
        });
        return {
          ...state,
          basket: updateBasket
        };
      }

    case type.REMOVE_FROM_BASKET:
      const index = state.basket.findIndex((item) => item.id === action.id);
      let newBasket = [...state.basket];

      if (index >= 0) {
        if (newBasket[index].amount > 1) {
          newBasket[index] = {
            ...newBasket[index],
            amount: newBasket[index].amount - 1
          };
        } else {
          newBasket.splice(index, 1);
        }
      }
      return {
        ...state,
        basket: newBasket
      };

    case type.EMPTY_BASKET:
      return {
        ...state,
        basket: []
      };

    case type.SET_USER:
      return {
        ...state,
        user: action.user,
        isAuthenticated: !!action.user,
        isLoading: false,
        authError: null
      };

    case type.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        authError: null
      };

    case type.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authError: action.error
      };

    case type.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        authError: null
      };

    case type.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authError: action.error
      };

    case type.LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authError: null,
        basket: []
      };

    case type.INITIALIZE_AUTH:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false
      };

    default:
      return state;
  }
};