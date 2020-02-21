import React, { useContext } from 'react';
import { Card, Image, Button, ButtonGroup } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const ActivityDetails: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    const {selectedActivity, openEditForm, closeForm, deselectedActivity} = activityStore;

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
                    <Button basic color="blue" content="Edit" onClick={() => openEditForm(selectedActivity!.id)} />
                    <Button basic color="grey" content="Cancel" onClick={() => {closeForm(); deselectedActivity();}} />
                </ButtonGroup>
            </Card.Content>
        </Card>
    );
};

export default observer(ActivityDetails);