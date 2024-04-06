import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './Admin.Actions';

export interface AuthState {
    user: any;
    error: any;
    
}

const initialState: AuthState = {
    user: null,
    error: null,
   
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.loggedIn, (state, { user }) => ({
        ...state,
        user,
        error: null,
    })),
    on(AuthActions.loginFail, (state, { error }) => ({
        ...state,
        error,
    })),
    on(AuthActions.logout, (state) => ({
        ...state,
        user: null,
        isAdmin: false,
    })),
    
);

export function reducer(state: AuthState | undefined, action: any) {
    return authReducer(state, action);
}
