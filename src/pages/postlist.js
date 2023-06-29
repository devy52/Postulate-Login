import React, { useState, useEffect } from 'react';
import theme from 'theme';
import { Theme, Link as QLink, Text, List, Box, Section, Icon } from '@quarkly/widgets';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import './home.css';
import './postlist.css';
import { FaTrash } from 'react-icons/fa';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetch('http://127.0.0.1:2000/api/posts', {
      headers: {
        'x-access-token': token,
      },
    })
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, [token]);

  const renderMedia = (post) => {
    if (post.file) {
      const fileExtension = post.file.split('.').pop().toLowerCase();
      const supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif'];
      const supportedVideoFormats = ['mp4', 'mov', 'avi', 'webm', 'mpeg2'];

      if (supportedImageFormats.includes(fileExtension)) {
        return <img src={`http://localhost:2000/uploads/${post.file}`} alt="Post" />;
      } else if (supportedVideoFormats.includes(fileExtension)) {
        return (
          <video controls>
            <source src={`http://localhost:2000/uploads/${post.file}`} type="video/mp4" />
          </video>
        );
      } else {
        return <p>Unsupported file format</p>;
      }
    }

    return null;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    history.replace('/index');
  };

  const handleDeletePost = async (postid) => {
    console.log('Delete button clicked');
    const response = await fetch(`http://127.0.0.1:2000/api/posts/${postid}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    });
    console.log('Token:', token);

    if (response.ok) {
      // Remove the deleted post from the posts array
      const updatedPosts = posts.filter((post) => post.id !== postid);
      setPosts(updatedPosts);
      window.location.reload();
    } else {
      console.error('Error deleting post');
    }
  };

  

  return (
    <Theme theme={theme}>
      <Helmet>
        <title>HomePage - JJ</title>
        <meta name="description" content="Web site created using quarkly.io" />
        <link rel="shortcut icon" href="https://uploads.quarkly.io/readme/cra/favicon-32x32.ico" type="image/x-icon" />
      </Helmet>
      <Section padding="0px 0 0px 0">
        <Box
          display="flex"
          padding="12px 0"
          justify-content="space-between"
          align-items="center"
          flex-direction="row"
          md-flex-direction="column"
        >
          <Text margin="0" md-margin="0px 0 20px 0" text-align="left" font="normal 900 50px/1.5 --fontFamily-googleTeko">
            JOURNEY DIARIES
          </Text>
          <Link to="#" color="#000000" />
          <List
            margin="0px 0px 0px 0px"
            padding="0px 0px 0px 20px"
            as="ul"
            list-style-type="none"
            flex="0 1 auto"
            order="1"
            display="flex"
          >
            <Link to="/" className="nl">
              Home
            </Link>
            <Link to="/" className="nl">
              Create
            </Link>
            <Link to="/" className="nl">
              Past Memories
            </Link>
            <Link to="/" className="navbtn" onClick={handleLogout}>
              Logout
            </Link>
          </List>
        </Box>
      </Section>
      <Section padding="80px 0 80px 0" background="url(https://wallpaperaccess.com/full/1386030.jpg) 0% 0%/cover no-repeat,#EDF2F6" sm-padding="60px 0 60px 0">
        <Box
          width="100%"
          display="flex"
          flex-direction="column"
          md-width="100%"
          md-align-items="center"
          md-justify-content="center"
          md-text-align="center"
          lg-width="100%"
          margin="0px 0px 56px 0px"
          align-items="center"
        >
          <Text margin="0px 0px 16px 0px" font="--headline2" color="--dark" md-text-align="center" sm-font="normal 700 32px/1.2 &quot;Source Sans Pro&quot;, sans-serif" text-align="center">
            Your Memories
          </Text>
        </Box>
        <Box display="grid" grid-template-columns="repeat(3, 1fr)" grid-gap="32px 4%" md-grid-template-columns="1fr">
          {posts.map((post) => (
            <Box
              padding="30px 45px"
              lg-padding="45px 30px"
              md-padding="45px 45px"
              background="#FFFFFF"
              border-radius="24px"
              justify-content="flex-start"
              flex-direction="column"
              display="flex"
              opacity="0.8"
              hover-opacity="1"
              hover-transform="skew(0deg, 0deg)"
              hover-mix-blend-mode="normal"
              mix-blend-mode="screen"
              md-opacity="1"
              md-mix-blend-mode="normal"
              key={post.id}
              className="post-card"
            >
              <p
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  color: '#fff',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                {post.date}
              </p>
              <h3 style={{ textAlign: 'left' }}>{post.title}</h3>
              {renderMedia(post)}
              <p>{post.content}</p>
              <button onClick={() => handleDeletePost(post.id)} className="dbtn">
                <Icon category="fa" icon={FaTrash} size="16px" />
              </button>
            </Box>
          ))}
        </Box>
      </Section>
      <Section background-color="--dark" text-align="center" padding="32px 0" quarkly-title="Footer-1">
        <List margin="0px 0px 0px 0px" padding="12px 0px 12px 0px" list-style-type="none" as="ul" display="flex" align-items="center" justify-content="center">
          <Link to="/" className="nl1">
            About
          </Link>
          <Link to="/" className="nl1">
            Services
          </Link>
          <Link to="/" className="nl1">
            Contacts
          </Link>
        </List>
        <QLink href="mailto:hello@company.com" text-decoration-line="none" variant="--base" color="--grey" hover-color="--primary">
          hello@company.com
        </QLink>
      </Section>
    </Theme>
  );
};

export default PostList;
