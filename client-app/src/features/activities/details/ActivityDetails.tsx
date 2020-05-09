import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailsHeader from './ActivityDetailsHeader';
import ActivityDetailsChat from './ActivityDetailsChat';
import ActivityDetailsInfo from './ActivityDetailsInfo';
import ActivityDetailsSidebar from './ActivityDetailsSidebar';

interface DetailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {selectedActivity, loadActivity, loadingInitial} = activityStore;

    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity, match.params.id])

    if (loadingInitial || !selectedActivity) {
        return <LoadingComponent content="Loading Activity" />
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailsHeader activity={selectedActivity} />
                <ActivityDetailsInfo activity={selectedActivity}/>
                <ActivityDetailsChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailsSidebar/>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);