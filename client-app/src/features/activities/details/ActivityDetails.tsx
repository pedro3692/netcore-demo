import React, { useContext, useEffect } from 'react';
import { Card, Image, Button, ButtonGroup } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps, Link } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';

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
        <Card fluid>
            <Image src={`/assets/categoryImages/${selectedActivity?.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{selectedActivity?.title}</Card.Header>
                <Card.Meta>
                    <span>{selectedActivity?.date}</span>
                </Card.Meta>
                <Card.Description>
                    {selectedActivity?.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonGroup widths={2}>
                    <Button as={Link}  to={`/manage/${selectedActivity.id}`} basic color="blue" content="Edit"  />
                    <Button basic color="grey" content="Cancel" onClick={() => {history.push("/activities")}} />
                </ButtonGroup>
            </Card.Content>
        </Card>
    );
};

export default observer(ActivityDetails);