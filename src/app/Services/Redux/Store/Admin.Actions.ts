import { createAction, props } from "@ngrx/store";

export const loggedIn = createAction("[Auth API] Login Success", props<{ user: any }>());

export const loginFail = createAction("[Auth API] Login Fail", props<{ error: any }>());

export const logout = createAction("[Auth API] Logout");


