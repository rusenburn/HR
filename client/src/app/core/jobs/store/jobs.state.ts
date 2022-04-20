import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { JobsState, reducer as jobsReducer } from "./jobs.reducer";


export interface JobSharedState {
    jobs: JobsState
}

export const reducers: ActionReducerMap<JobSharedState> = {
    jobs: jobsReducer
}

export const metaReducers: MetaReducer<JobSharedState>[] = [];