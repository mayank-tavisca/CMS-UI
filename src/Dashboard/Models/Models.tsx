import React, { useState, Fragment, useEffect } from "react";
import * as MockData from "../../data";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  makeStyles,
  Fab
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Styles from "./Models.module.scss";
import { DataService } from "./../../Services/dataService";
import AddModelPopover from "../AddModelPopover/AddModelPopover";
import AddIcon from "@material-ui/icons/Add";

const columns = [
  {
    id: "type",
    label: "Name"
  },
  {
    id: "schemaVersion",
    label: "Schema Version"
  },
  {
    id: "lastModifiedOn",
    label: "Updated"
  }
];

// const rows = MockData.MockModels;

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

const Models = () => {
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [models, setModels] = useState<any>([]);
  const [addModelPopoverOpen, setAddModelPopoverOpen] = useState(false);

  const dataService = new DataService();

  useEffect(() => {
    dataService.getContetTypes().then((resp: any) => {
      console.log(resp);
      if (resp.status === 200) {
        setModels(resp.data.data);
      }
    });
  }, []);

  const closeModelPopover = () => {
    setAddModelPopoverOpen(false);
  };

  const toggleAddModelPopover = () => {
    setAddModelPopoverOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const redirectToModelDetails = model => {
    history.push("/dashboard/models/" + model.id);
  };

  const renderTable = () => {
    return (
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {models
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((model: any) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={model.id}
                    >
                      {columns.map(column => {
                        const value = model[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            onClick={() => {
                              redirectToModelDetails(model);
                            }}
                          >
                            {value && column.id === "lastModifiedOn"
                              ? new Date(value).toLocaleString()
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={models.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
  };
  return (
    <Fragment>
      <div className={Styles.container}>
        <h3>Content Models</h3>

        {renderTable()}
        <Fab onClick={toggleAddModelPopover} className={Styles.addIcon}>
          <AddIcon />
        </Fab>

        <AddModelPopover
          handleClose={closeModelPopover}
          open={addModelPopoverOpen}
        />
      </div>
    </Fragment>
  );
};

export default Models;
