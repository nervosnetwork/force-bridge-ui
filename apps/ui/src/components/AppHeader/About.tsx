import { Modal } from 'antd';
import React, { useCallback } from 'react';
import { useForceBridge } from 'state';

export const About: React.FC = () => {
  const { version } = useForceBridge();

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
