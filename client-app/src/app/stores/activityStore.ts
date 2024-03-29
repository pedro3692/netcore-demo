import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/IActivity';
import agent from '../../api/agent';

configure({enforceActions: "always"});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable selectedActivity: IActivity|null = null;
    @observable loadingInitial: boolean = false;
    @observable submitting: boolean = false;
    @observable target: string = "";

    @computed get activitiesByDate(): [string, IActivity[]][] {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
    };

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(    
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split("T")[0];
            activities[date] = activities[date] ?  [...activities[date], activity]: [activity];
            return activities;
        }, {} as {[key: string]: IActivity[]}));
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

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if(activity) {
            this.selectedActivity = activity;
        } else {
            this.loadingInitial = true;
            
            try {
                activity = await agent.Activities.details(id);
                runInAction("getting activity", () => {
                    this.selectedActivity = activity;
                    this.loadingInitial = false;
                });
            } catch (error) {
                runInAction("get activity error", () => {
                    console.error(error);
                    this.loadingInitial = false;
                });
            }
        }

    };

    @action clearActivity = () => {
        this.selectedActivity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.create(activity);
            runInAction("creating activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
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
                this.submitting = false;
            });
        } catch (error) {
            runInAction("delete activity error", () => {
                this.submitting = false;
                console.error(error);
            });
        }
    }
}

export default createContext(new ActivityStore());