import { useState } from "react";
import { Button, Card, Container, Form, ListGroup } from "react-bootstrap";
import { ArrowCounterclockwise, ArrowsCollapse } from "react-bootstrap-icons";
import { FileUploader } from "react-drag-drop-files";
import FileListItem from "./FileListItem";
import _ from "lodash";
import { useCompressMutation, useGetZipBlobMutation } from "../api/apiSlice";
import Swal from "sweetalert2";

const Component = () => {
  const [files, setFiles] = useState<
    Array<{ file: File; isError?: boolean; newSize?: number }>
  >([]);
  const [sessionId] = useState<number>(+new Date());
  const fileTypes = ["JPG", "PNG", "JPEG"];

  const [compress] = useCompressMutation();
  const [getZipBlob] = useGetZipBlobMutation();

  const handleChange = (newFiles: FileList) => {
    let files: Array<{ file: File; isError?: boolean; newSize?: number }> =
      Array.from(newFiles).map((file) => ({ file }));
    setFiles(files);

    const len = files.length;
    for (let i = 0; i < len; i++) {
      const { file } = files[i];
      compress({ file, sessionId })
        .unwrap()
        .then((res) => {
          files = files.map((f, j) =>
            i === j ? { file, newSize: res.newSize } : f
          );
          setFiles(files);
        })
        .catch(() => {
          files = files.map((f, j) => (i === j ? { file, isError: true } : f));
          setFiles(files);
        });
    }
  };

  const handleDownload = () => {
    getZipBlob(sessionId)
      .unwrap()
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compressed_jpg_${sessionId}.zip`;
        a.click();
      })
      .catch(() => {
        Swal.fire({
          icon: "warning",
          toast: true,
          showConfirmButton: false,
          position: "top-end",
          timer: 5000,
          timerProgressBar: true,
          text: "The session is expired, please refresh and upload again.",
        });
      });
  };

  const isCompleted = files.every(
    (f) => _.isNumber(f.newSize) || _.isBoolean(f.isError)
  );
  const isAllError = files.every((f) => f.isError);
  const isReadyToDownload = isCompleted && !isAllError;

  return (
    <Container>
      <Card>
        <Card.Body>
          {files.length === 0 && (
            <>
              <Form.Label as="h3">
                This app reduces the size of images effectively
                <br /> while{" "}
                <b style={{ color: "green" }}> MAINTAINING QUALITY</b>.
              </Form.Label>
              <br />
              <Form.Label>Select Image....</Form.Label>
              <FileUploader
                multiple
                handleChange={handleChange}
                name="file"
                types={fileTypes}
              />
            </>
          )}
          {files.length > 0 && (
            <>
              {isReadyToDownload && (
                <Button
                  variant="success"
                  className="mb-2"
                  onClick={handleDownload}>
                  Download
                </Button>
              )}

              <ListGroup>
                {files.map(({ file, isError, newSize }, i) => (
                  <FileListItem
                    key={i}
                    id={i + 1}
                    file={file}
                    isError={isError}
                    newSize={newSize}
                  />
                ))}
              </ListGroup>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Component;
