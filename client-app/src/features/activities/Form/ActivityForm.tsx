import React, { useState, FormEvent, useContext } from 'react';
import { IActivity } from '../../../app/models/IActivity';
import { Form, Segment, Button } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';


const ActivityForm: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    const {selectedActivity, createActivity, editActivity, submitting, closeForm} = activityStore;
    const initializeForm = () => {

    if(selectedActivity) {
        return selectedActivity;
    } else {
        return {
            id: "",
            title: "",
            category: "",
            description: "",
            date: "",
            city: "",
            venue: "",
        };
    }
};

    const [activity, setActivity] = useState<IActivity>(initializeForm);

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

            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input  label="Title" value={activity.title} name="title" onChange={handleInputChange} />
                <Form.TextArea  label="Description"  rows={2} value={activity.description}  name="description" onChange={handleInputChange} />
                <Form.Input  label="Category"  value={activity.category} name="category" onChange={handleInputChange}  />
                <Form.Input label="Date" type="datetime-local" value={activity.date}  name="date" onChange={handleInputChange} />
                <Form.Input label="City" value={activity.city}  name="city" onChange={handleInputChange} />
                <Form.Input label="Venue" value={activity.venue}  name="venue" onChange={handleInputChange} />
                <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
                <Button floated="right" type="button" content="Cancel" onClick={closeForm} />
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);