import { Modal } from 'antd';
import React, { useCallback } from 'react';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';

export const About: React.FC = () => {
  const { version } = ForceBridgeContainer.useContainer();

  const popupAbout = useCallback(() => {
    Modal.info({
      closable: true,
      width: 320,
      title: 'About',
      icon: null,
      content: (
        <div>
          git-sha:&nbsp;
          <a href={version.repoUrlWithSha} target="_blank" rel="noreferrer">
            {version.sha.slice(0, 6)}
          </a>
        </div>
      ),
    });
  }, [version.repoUrlWithSha, version.sha]);

  return <div onClick={popupAbout}>About</div>;
};
