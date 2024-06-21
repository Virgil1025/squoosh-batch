import { Col, Container, Form, Row } from "react-bootstrap";

const Component = () => {
  return (
    <Container>
      <Row>
        <Col xl={7}>
          <img
            style={{ display: "inline-block" }}
            src="./Fugro-Logo-RGB-WH.png"
            alt="Fugro Logo"
            height="45px"
          />
          <Form.Label
            style={{
              display: "inline-block",
              fontWeight: "bold",
              fontSize: "1.2em",
            }}>
            Images Reducer
          </Form.Label>
        </Col>
        <Col xl={5} className="text-end">
          <small>© {new Date().getFullYear()} Powered by AIM Team</small>
        </Col>
      </Row>
    </Container>
  );
};

export default Component;
