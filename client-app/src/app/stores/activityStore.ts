import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/IActivity';
import agent from '../../api/agent';

configure({enforceActions: "always"});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable selectedActivity: IActivity|undefined;
    @observable loadingInitial: boolean = false;
    @observable submitting: boolean = false;
    @observable target: string = "";
    @observable editMode: boolean = false;

    @computed get activitiesByDate(): IActivity[] {
        return Array.from(this.activityRegistry.values())
            .sort(
                (a, b) => Date.parse(a.date) - Date.parse(b.date)
            );
    };

    
    @action loadActivities = async () => {
        this.loadingInitial = true;
        try{
            const activities = await agent.Activities.list() 
            runInAction("loading activities", () => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
        } catch(error) {
            runInAction("load activities error", () => {
                this.loadingInitial = false;
                console.error(error);
            });
        }
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.create(activity);
            runInAction("creating activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction("create activity error", () => {
                this.submitting = false;
                console.error(error);
            });
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction("editing activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction("edit activity error", () => {
                this.submitting = false;
                console.error(error);
            });
        }
    }

    @action deleteActivity = async (event:SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction("deliting activity", () => {
                this.activityRegistry.delete(id);
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction("delete activity error", () => {
                this.submitting = false;
                console.error(error);
            });
        }
    }

    @action openCreateForm = () => {
        this.selectedActivity = undefined;
        this.editMode = true;
    }; 

    @action openEditForm = (id: string) => {
        
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }; 

    @action closeForm = () => {
        this.editMode = false;
    }; 

    @action deselectedActivity = () => {
        this.selectedActivity = undefined;
    }; 


    @action selectActivity =  (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };
}

export default createContext(new ActivityStore());