import React from 'react'
import { Segment, Image, Item, Header, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/IActivity';
import { observer } from 'mobx-react-lite';

const activityImageStyle = {
    filter: "brightness(30%)"
};

const activityImageTextStyle = {
    position: "absolute",
    bottom: "5%",
    left: "5%",
    width: "100%",
    height: "auto",
    color: "white"
};

const ActivityDetailsHeader: React.FC<{activity: IActivity}> = ({activity}) => {
    return (
        <Segment.Group>
            <Segment basic attached="top" style={{ padding: "0" }}>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header size="huge" content={activity.title} style={{ color: "white" }}/>
                                <p>{activity.date}</p>
                                <p>
                                    Hosted by <strong>Lost</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached="bottom">
                <Button color="teal">Joint Activity</Button>
                <Button >Cancel Attencance</Button>
                <Button color="orange" floated="right">Manage Event</Button>
            </Segment>
        </Segment.Group>
    )
}

export default observer(ActivityDetailsHeader)