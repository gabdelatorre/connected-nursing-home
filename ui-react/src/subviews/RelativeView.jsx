import moment from "moment";
import React, { Component, optionsState } from "react";
import { FirebaseContext } from "../firebase";
import { withFirebase } from "../firebase/context";
import { Grid, Row, Col, Glyphicon } from "react-bootstrap";
import RelativeMyList from "./RelativeMyList";
import RelativeAllList from "./RelativeAllList";

class RelativeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempStorageOfData: {
        firstName: null,
        lastName: null,
        id: null
      },
      arrayOfAllRelative: [],
      arrayOfPatientRelative: []
    };
    this.toggleRelative();
  }

  componentWillMount() {
    

  }

  searchCheckUp() {
    var patientId = "KEr41uK5SZOmwy5Fd1CZ";
    var date = document.querySelector("#dateTxt").value;
    var newDate = new Date(date);
    var finalDate =
      newDate.getMonth() +
      1 +
      "-" +
      newDate.getDate() +
      "-" +
      newDate.getFullYear();
    console.log(finalDate);

    this.props.firebase.db
      .collection("patients")
      .doc(patientId)
      .collection("vital_statistics")
      .where("timestamps", "==", finalDate)
      .get()
      .then(data => {
        data.docs.forEach(data => {
          this.setVal("bloodPressure", data.data().blood_pressure);
          this.setVal("height", data.data().height);
          this.setVal("weight", data.data().weight);
          this.setVal("temperature", data.data().temperature);
          this.setVal("remarks", data.data().remarks);
        });
      });

    this.props.firebase.db.collection("patients").onSnapshot(e => {
      e.docs.forEach(e => {
        this.props.firebase.db
          .collection("patients")
          .doc(e.id)
          .collection("vital_statistics")
          .where("timestamps", "==", finalDate)
          .get()
          .then(data => {
            data.docs.forEach(data => {
              console.log(data.data());
            });
          });
      });
    });
  }

  goBack() {
    this.props.switchDashboardView("DASHBOARD");
  }

  toggleHealthExaminationForm() {
    if (this.state.showHealthExaminationForm) {
      this.setState({
        showHealthExaminationForm: false
      });
    } else {
      this.setState({
        showHealthExaminationForm: true
      });
    }
  }

  setHealthStatGraph(healthstat) {
    this.setState({
      selectedHealthStatGraph: healthstat
    });
  }

  toggleHealthExaminationRecord(record) {
    if (this.state.showHealthExaminationRecord) {
      this.setState({
        showHealthExaminationRecord: false,
        selectedHealthExaminationRecord: null
      });
    } else {
      this.setState({
        showHealthExaminationRecord: true,
        selectedHealthExaminationRecord: record
      });
    }
  }



  toggleRelative(){
    
    var patientId = this.props.selectedPatient.id;
    this.props.firebase.db.collection("patients").doc(patientId).collection("relatives").onSnapshot(e =>{
      this.setState({
        tempStorageOfData: {
          firstName: null,
          lastName: null,
          id: null
        },
        arrayOfPatientRelative: []
      });
        e.docs.forEach(e =>{
          this.setState({
            tempStorageOfData: {
              firstName: e.data().firstName,
              lastName: e.data().lastName,
              id: e.id
            },
          });
          
          this.setState ({
            arrayOfPatientRelative: this.state.arrayOfPatientRelative.concat(
              this.state.tempStorageOfData
            )
          })
        })
    })

    this.setState({
      tempStorageOfData: {
        firstName: null,
        lastName: null,
        id: null
      }
    });
   

this.splitAllRelativeAndMyRelative();
}

splitAllRelativeAndMyRelative() {
 
  this.props.firebase.db
  .collection("users")
  .where("role", "==", "RELATIVE")
  .get()
  .then(e => {
    e.docs.forEach(data => {
      this.setState({
        tempStorageOfData: {
          firstName: data.data().firstName,
          lastName: data.data().lastName,
          id: data.id
        },
      });

      if (this.state.arrayOfPatientRelative.includes(this.state.tempStorageOfData)) {
       
        this.setState({
          tempStorageOfData: {
            firstName: null,
            lastName: null,
            id: null
          }
        });
      } else {
        
      this.setState ({
        arrayOfAllRelative: this.state.arrayOfAllRelative.concat(
          this.state.tempStorageOfData
        )
      });

    }


    });    
  });
  


}


  render() {
    if (this.props.userRole == "Admin") {
    return (
      <div className="nurse-assigned-view">
        <Grid fluid className="nopads">
        <Row>
            <Col lg={12}>
              <Row>
                <Col lg={12}>
                  <div>
                    <div className="my-nurses-card">
                      <div className="card-header">
                        <span className="card-label">
                          {" "}
                          Relatives Assigned{" "}
                        </span>
                      </div>
                      <div className="card-content">
                        <Row>
                          <Col lg={12}>
                            <RelativeMyList view="My-Relative" selectedPatient={this.props.selectedPatient} arrayOfPatientRelative={this.state.arrayOfPatientRelative}/>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>


          <Row>
            <Col lg={12}>
              <Row>
                <Col lg={12}>
                  <div>
                    <div className="list-of-nurses-card">
                      <div className="card-header">
                        <span className="card-label">
                          {" "}
                          List of Relatives{" "}
                        </span>
                      </div>
                      <div className="card-content">
                        <Row>
                          <Col lg={12}>
                            <RelativeAllList view="All-Relative" selectedPatient={this.props.selectedPatient} arrayOfAllRelative={this.state.arrayOfAllRelative}/>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  } else {
    return (
      <div className="nurse-assigned-view">
        <Grid fluid className="nopads">
        <Row>
            <Col lg={12}>
              <Row>
                <Col lg={12}>
                  <div>
                    <div className="my-nurses-card">
                      <div className="card-header">
                        <span className="card-label">
                          {" "}
                          Relatives Assigned{" "}
                        </span>
                      </div>
                      <div className="card-content">
                        <Row>
                          <Col lg={12}>
                            <RelativeMyList view="My-Relative" selectedPatient={this.props.selectedPatient} arrayOfPatientRelative={this.state.arrayOfPatientRelative}/>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  }
}

export default withFirebase(RelativeView);
