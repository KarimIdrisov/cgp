import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: 'space-between',
        overflowX: 'auto',
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
        fontSize: "1.3rem",
        color: "#333",
        textDecoration: "none",


    },
}));

export default function Header(props) {
    const classes = useStyles();
    const {sections, title} = props;

    return (
        <React.Fragment>
            <Toolbar className={classes.toolbar}>
                <Typography component="h2" variant="h5" color="inherit" align="center" noWrap
                            className={classes.toolbarTitle}>
                    {title}
                </Typography>
            </Toolbar>
            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                {sections.map((section) => (
                    <Link color="inherit" noWrap key={section.title}  to={section.link}
                          className={classes.toolbarLink}>
                        <Typography variant="h6">{section.title}</Typography>
                    </Link>
                ))}
            </Toolbar>
        </React.Fragment>
    );
}

Header.propTypes = {
    sections: PropTypes.array,
    title: PropTypes.string,
};
