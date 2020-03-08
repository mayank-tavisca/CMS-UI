import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as MockData from "../../data";
import {
  Button,
  FormControl,
  FormGroup,
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
import Styles from "./Home.module.scss";
import { useHistory } from "react-router-dom";
import { DataService } from "../../Services/dataService";
import AddIcon from "@material-ui/icons/Add";
import AddPagePopover from "../AddPagePopover/AddPagePopover";

const columns = [
  { id: "name", label: "Page name" },
  { id: "version", label: "Verion" },
  { id: "lastModifiedOn", label: "Updated" }
];

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

const Home = () => {
  const history = useHistory();
  const classes = useStyles();
  const dataService = new DataService();

  const [pagePopoverOpen, setPagePopoverOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchSetting, setSearchSetting] = useState({
    client: "",
    account: "",
    type: ""
  });
  const [pageConfigs, setPageConfigs] = useState([]);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const redirectToContent = data => {
    history.push(`dashboard/content/${data.id}`);
  };

  const handleChange = (e, option, type) => {
    searchSetting[type] = option;
    setSearchSetting({ ...searchSetting });
    console.log(searchSetting);
  };

  const handleSearch = () => {
    dataService.getAllContentPages().then((res: any) => {
      if (res.status === 200) {
        setPageConfigs(res.data.data);
      }
    });
  };

  const closePagePopover = () => {
    setPagePopoverOpen(false);
  };

  const toggleAddNewPagePopover = () => {
    setPagePopoverOpen(true);
  };

  const renderSelectionForm = () => {
    return (
      <form className={Styles.form}>
        <FormGroup className={Styles.formGroup}>
          <FormControl className={Styles.formControl}>
            <Autocomplete
              id="client"
              options={MockData.Clients}
              getOptionLabel={option => option.label}
              style={{ width: 300 }}
              onChange={(e, option) => handleChange(e, option, "client")}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Client"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </FormControl>
          <FormControl className={Styles.formControl}>
            <Autocomplete
              id="account"
              options={MockData.Accounts}
              getOptionLabel={option => option.label}
              onChange={(e, option) => handleChange(e, option, "account")}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Account"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </FormControl>
          <FormControl className={Styles.formControl}>
            <Autocomplete
              id="page"
              options={MockData.Pages}
              getOptionLabel={option => option.label}
              onChange={(e, option) => handleChange(e, option, "page")}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Page"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </FormControl>
        </FormGroup>
        <Button
          className={Styles.submitBtn}
          color="primary"
          variant="contained"
          onClick={handleSearch}
        >
          Search
        </Button>
      </form>
    );
  };

  const renderPageTable = () => {
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
              {(pageConfigs || [])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            onClick={() => redirectToContent(row)}
                            key={column.id}
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
          count={pageConfigs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
  };

  return (
    <div className={Styles.container}>
      <h3>Select a page to edit</h3>

      {renderSelectionForm()}
      {pageConfigs.length ? renderPageTable() : false}

      <Fab onClick={toggleAddNewPagePopover} className={Styles.addIcon}>
        <AddIcon />
      </Fab>

      <AddPagePopover handleClose={closePagePopover} open={pagePopoverOpen} />
    </div>
  );
};

export default Home;
