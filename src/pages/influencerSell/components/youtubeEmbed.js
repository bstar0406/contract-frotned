import React from "react";
import PropTypes from "prop-types";
import "./youtubeStyle.css";
var getYouTubeID = require("get-youtube-id");

const YoutubeEmbed = ({ embedId }) => {
  const _id = getYouTubeID(embedId);
  return (
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${_id}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
