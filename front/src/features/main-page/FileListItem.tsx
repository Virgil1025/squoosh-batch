import { Col, ListGroup, Row, Badge, Form } from "react-bootstrap";
import _ from "lodash";
import { ArrowRight } from "react-bootstrap-icons";

type Prop = {
  id: number;
  file: File;
  isError?: boolean;
  newSize?: number;
};

const Component = (prop: Prop) => {
  const { file, id, isError, newSize } = prop;
  const { size: originalSize, name } = file;

  const sizeInReadable = (size: number) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let _size = size;
    while (_size > 1024) {
      _size /= 1024;
      i++;
    }
    return `${_size.toFixed(2)} ${units[i]}`;
  };

  const changedPercentageBadge = (originalSize: number, newSize: number) => {
    const percentage = ((newSize - originalSize) / originalSize) * 100;
    const bg = percentage > 0 ? "danger" : "success";
    const prefix = percentage > 0 ? "+" : "-";

    return (
      <Badge bg={bg} className="mx-2">{`${prefix}${Math.abs(percentage).toFixed(
        0
      )}%`}</Badge>
    );
  };

  return (
    <ListGroup.Item>
      <Row className="my-0 py-0">
        <Col xs={1}>{id}</Col>
        <Col>{name}</Col>
        <Col>
          {sizeInReadable(originalSize)}{" "}
          {_.isNumber(newSize) && (
            <Form.Label as="span" style={{ color: "green" }}>
              <ArrowRight className="mx-2" />
              {sizeInReadable(newSize)}
              {changedPercentageBadge(originalSize, newSize)}
            </Form.Label>
          )}
          {isError && <Badge bg="danger">Failed to Compress</Badge>}
          {_.isUndefined(newSize) && _.isUndefined(isError) && (
            <Badge color="info">Compressing...</Badge>
          )}
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default Component;
