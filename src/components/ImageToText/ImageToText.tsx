import { Fragment, useState } from "react";
import * as Tesseract from "tesseract.js";
import ImageIcon from "@material-ui/icons/Image";
import CloseIcon from "@material-ui/icons/Close";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  LinearProgress,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { saveAs } from "file-saver";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      minWidth: 250,
      maxWidth: 350,
    },
    title: {
      fontSize: 14,
      fontWeight: "bold",
      textAlign: "center",
      margin: 10,
    },
    content: {
      marginTop: 10,
    },
    cardItems: {
      marginBottom: 10,
    },
    actions: {
      display: "flex",
      justifyContent: "center",
    },
  })
);

export function ImageToText(props: any) {
  const classes = useStyles();
  const [uploads, setUploads] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [resultText, setResultText] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleInputChange = (event: any) => {
    setResultText("");
    if (event.target.files[0]) {
      var uploads = [];
      for (var key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key];
        setFileName(event.target.files[key].name);
        uploads.push(URL.createObjectURL(upload));
      }
      setUploads(uploads);
    } else {
      setUploads([]);
      setFileName("");
    }
  };

  const generateText = () => {
    let images = uploads;
    for (var i = 0; i < images.length; i++) {
      setLoading(true);
      Tesseract.recognize(images[i], "eng")
        .catch((err) => {
          console.error(err);
          setFileName("");
          setLoading(false);
          setResultText("");
          setOpenSnackBar(true);
        })
        .then((result) => {
          setFileName("");
          let text: any = result;
          setResultText(text.data.text);
          setLoading(false);
        });
    }
  };
  const handleExportTxt = () => {
    const data = new Blob([resultText], { type: "text/plain" });
    saveAs(data, "ImageToText.txt");
  };

  const handleCloseSnackBar = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <Fragment>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} color="inherit" gutterBottom>
            Convert Image to Text
          </Typography>
          <Divider />
          <Typography align="center">
          <Button className={classes.content}
            variant="contained"
            color="primary"
            component="label"
            size="small"
            startIcon={<ImageIcon />}
          >
            Upload File
            <input type="file" hidden onChange={handleInputChange} />
          </Button>
          </Typography>
          <Typography paragraph align="center">
            {fileName}
          </Typography>
          <Typography align="center">
            <Button
              className={classes.cardItems}
              variant="contained"
              size="small"
              color="primary"
              onClick={generateText}
            >
              Generate Text
            </Button>
          </Typography>
          {loading && <LinearProgress className={classes.cardItems} />}
        </CardContent>
        {resultText.length > 0 && (
          <CardActions className={classes.actions} disableSpacing>
            <Button
              size="small"
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(resultText);
              }}
            >
              Copy to clipboard
            </Button>
            <Button size="small" color="primary" onClick={handleExportTxt}>
              Download
            </Button>
          </CardActions>
        )}
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={openSnackBar}
        autoHideDuration={2500}
        onClose={handleCloseSnackBar}
        message="Error while retriving data"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Fragment>
  );
}
