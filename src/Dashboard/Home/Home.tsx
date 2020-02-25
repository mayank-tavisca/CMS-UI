import React, { useState } from "react";
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
  makeStyles
} from "@material-ui/core";
import Styles from "./Home.module.scss";
import { useHistory } from "react-router-dom";
import { DataService } from "../../Services/dataService";

const columns = [
  { id: "name", label: "Page name" },
  { id: "version", label: "Verion Number" },
  { id: "modules", label: "Modules Available" }
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchSetting, setSearchSetting] = useState({
    client: "",
    account: "",
    type: ""
  });
  const [pageConfigs, setPageConfigs] = useState([]);

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
    dataService.getPagesByClientAndAccountId(1, 1).then((res: any) => {
      console.log(res);

      setPageConfigs(res.data);
    });
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
                            {value}
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
    </div>
  );
};

export default Home;
