import React, { SyntheticEvent } from 'react';
import { Grid } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/IActivity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../Form/ActivityForm';


interface IProps {
    activities: IActivity[];
    selectedActivity: IActivity|null;
    selectActivity: (id: string) => void;
    setSelectedActivity: (activity: IActivity|null) => void;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    submitting: boolean;
    target: string;
}

const ActivityDashboard: React.FC<IProps> = ({activities, selectedActivity, selectActivity, setSelectedActivity, editMode, setEditMode, createActivity, editActivity, deleteActivity, submitting, target}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities}  selectActivity={selectActivity} setEditMode={setEditMode} deleteActivity={deleteActivity} submitting={submitting} target={target} />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode && <ActivityDetails selectedActivity={selectedActivity} setSelectedActivity={setSelectedActivity}  setEditMode={setEditMode} />}
                {editMode && <ActivityForm key={selectedActivity?.id || 0} selectedActivity={selectedActivity} setEditMode={setEditMode} createActivity={createActivity} editActivity={editActivity} submitting={submitting} />}
            </Grid.Column>
        </Grid>
    );
};

export default ActivityDashboard;