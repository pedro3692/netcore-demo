import React , { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/IActivity'
import NavBar from '../../features/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../../api/agent';
import LoadingComponent from './LoadingComponent';

const App = () =>  {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity|null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [target, setTarget] = useState<string>("");

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
  }

  const handleOpenCreateFrom = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleDeleteActivity = (event:SyntheticEvent<HTMLButtonElement> , id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let  activities:IActivity[] = [];

        response.forEach((activity) => {
            activity.date = activity.date.split(".")[0];
            activities.push(activity);
        });

        setActivities(activities)
    }).then(() => setLoading(false));
  }, []);

  if(loading){
    return <LoadingComponent content="Loading Activities"/>
  }
  return (
    <Fragment>
      <NavBar handleOpenCreateForm={handleOpenCreateFrom} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard activities={activities} 
                  selectedActivity={selectedActivity} 
                  selectActivity={handleSelectActivity}
                  setSelectedActivity={setSelectedActivity}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  createActivity={handleCreateActivity}
                  editActivity={handleEditActivity}
                  deleteActivity={handleDeleteActivity}
                  submitting={submitting}
                  target={target} />
      </Container>
    </Fragment>  
  );
}

export default App;
