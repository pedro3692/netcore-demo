import React, { useState, FormEvent } from 'react';
import { IActivity } from '../../../app/models/IActivity';
import { Form, Segment, Button } from 'semantic-ui-react';
import {v4 as uuid} from 'uuid';


interface IProps {
    selectedActivity: IActivity|null;
    setEditMode: (editMode: boolean) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    submitting: boolean;
}

const ActivityForm: React.FC<IProps> = ({selectedActivity, setEditMode, createActivity, editActivity, submitting}) => {

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
                <Button floated="right" positive type="submit" content="Submit" />
                <Button floated="right" type="button" content="Cancel" onClick={ () => setEditMode(false)} />
            </Form>
        </Segment>
    );
};

export default ActivityForm;