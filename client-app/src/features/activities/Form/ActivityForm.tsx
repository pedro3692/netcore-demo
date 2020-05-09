import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { IActivity } from '../../../app/models/IActivity';
import { Form, Segment, Button, Grid } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';


interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {selectedActivity, createActivity, editActivity, submitting, loadActivity, clearActivity} = activityStore;
   
    const [activity, setActivity] = useState<IActivity>({
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
    });   

    useEffect( () => {
        if(match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(() => selectedActivity && setActivity(selectedActivity))
        }

        return () => {
            clearActivity()
        };
    }, [loadActivity, clearActivity, match.params.id, selectedActivity, activity.id.length]);

    const handleInputChange = (event: FormEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        
        setActivity({...activity, [name]: value});    
    }

    const handleSubmit = () => {
        if(activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }

            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id})`));
        } else {
            editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input  label="Title" value={activity.title} name="title" onChange={handleInputChange} />
                        <Form.TextArea  label="Description"  rows={2} value={activity.description}  name="description" onChange={handleInputChange} />
                        <Form.Input  label="Category"  value={activity.category} name="category" onChange={handleInputChange}  />
                        <Form.Input label="Date" type="datetime-local" value={activity.date}  name="date" onChange={handleInputChange} />
                        <Form.Input label="City" value={activity.city}  name="city" onChange={handleInputChange} />
                        <Form.Input label="Venue" value={activity.venue}  name="venue" onChange={handleInputChange} />
                        <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
                        <Button floated="right" type="button" content="Cancel" onClick={() => history.push(`/activities/${activity.id}`)} />
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>

    );
};

export default observer(ActivityForm);