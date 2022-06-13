import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import { RiHome4Line } from "react-icons/ri";
import { MdStore } from "react-icons/md";
import { FiGrid } from "react-icons/fi";
import { GiSellCard } from "react-icons/gi";
import { MdApi } from "react-icons/md";
import { FaVoteYea } from "react-icons/fa";
import { CgCommunity } from "react-icons/cg";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import baba from "../../../assets/images/baba.png";

function DrawerComponent(props) {
  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  return (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem className="sidebar_icons">
          <ListItemIcon className="baba_img">
            <img src={baba} alt="logo" />
          </ListItemIcon>
        </ListItem>

          <ListItem
              button
              className="sidebar_icons"
              onClick={props.handleDrawerToggle}
          >
            <ListItemIcon>
              <MdApi className="font_job_si"/>
            </ListItemIcon>
            <ListItemText className="ttle_clr_ssbr" primary="SET WALLET TO BINANCE SMART CHAIN(BSC)"/>{" "}
          </ListItem>

        <Link to="/">
          <ListItem
            button
            className="sidebar_icons"
            onClick={props.handleDrawerToggle}
          >
            <ListItemIcon>
              <FiGrid className="font_job_si" />
            </ListItemIcon>
            <ListItemText className="ttle_clr_ssbr" primary="Dashboard" />{" "}
          </ListItem>
        </Link>
        <a
          href="https://travelfutures.club/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItem
            button
            className="sidebar_icons"
            onClick={props.handleDrawerToggle}
          >
            <ListItemIcon>
              <RiHome4Line className="font_job_si" />
            </ListItemIcon>
            <ListItemText className="ttle_clr_ssbr" primary="Home Page" />{" "}
          </ListItem>
        </a>
        <Link to="/sell">
          <ListItem
            button
            className="sidebar_icons"
            onClick={props.handleDrawerToggle}
          >
            <ListItemIcon>
              <GiSellCard className="font_job_si" />
            </ListItemIcon>
            <ListItemText className="ttle_clr_ssbr" primary="Sell" />
          </ListItem>
        </Link>

        <Link to="/marketv2">
          <ListItem
            button
            className="sidebar_icons"
            onClick={props.handleDrawerToggle}
          >
            <ListItemIcon>
              <MdStore className="font_job_si" />
            </ListItemIcon>
            <ListItemText primary="Marketplace V2" className="jobs_clr" />
          </ListItem>
        </Link>

        <Link to="/create">
          <ListItem
            button
            className="sidebar_icons"
            onClick={props.handleDrawerToggle}
          >
            <ListItemIcon>
              <FiGrid className="font_job_si" />
            </ListItemIcon>
            <ListItemText className="ttle_clr_ssbr" primary="Create" />
          </ListItem>
        </Link>

        <Link to ="/community">
        <ListItem
            button
            className="sidebar_icons"
            onClick={props.handleDrawerToggle}
        >
          <ListItemIcon>
            <CgCommunity className="font_job_si"/>
          </ListItemIcon>
          <ListItemText className="ttle_clr_ssbr" primary="COMMUNITY"/>{" "}
        </ListItem>
        </Link>
      </List>
    </div>
  );
}

export default DrawerComponent;
