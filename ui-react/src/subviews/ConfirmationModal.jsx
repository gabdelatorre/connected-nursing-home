import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Grid, Row, Col, Button
} from 'react-bootstrap';
import { withFirebase } from "./../firebase/context";

export class ConfirmationModal extends Component{

    constructor () {
        super();
    }

    render () {
      return(
        <div className="confirm-modal">
          <Modal show={this.props.show} onHide={this.props.onHide} bsSize="medium">
            <Modal.Header>
                <Modal.Title className="modal-title">
                    {this.props.header ? this.props.header : "Confirm Action"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-cont">
              <Grid fluid>
                <Row className="field-row-entry">
                    <Col lg={12} md={12} sm={12} xs={12}>
                      <h3 class="text-center">
                        {this.props.message ? this.props.message : "Are you sure?"}
                      </h3>
                    </Col>
                </Row>
                <Row className="field-row-entry pull-right">
                    <Col lg={6} md={6} sm={6} xs={6}>
                      <Button onClick={() => {this.props.onAction("CONFIRMED")}} className="modal-action-btn">
                            Confirm
                      </Button>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={6}>
                      <Button onClick={() => {this.props.onAction("CANCELLED")}} className="modal-action-btn">
                            Cancel
                      </Button>
                    </Col>
                </Row>
              </Grid>
            </Modal.Body>
          </Modal>
        </div>
      )
    }
}

export default withFirebase(ConfirmationModal);
