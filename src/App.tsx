/**
 * Since this file is for development purposes only, some of the dependencies are in devDependencies
 * Disabling ESLint rules for these dependencies since we know it is only for development purposes
 */

import React, { useCallback, useEffect, useState, useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOMClient from 'react-dom/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import styled, { createGlobalStyle } from 'styled-components';
import shuffle from 'lodash/shuffle';
import {
  useFocusable,
  init,
  FocusContext,
  FocusDetails,
  FocusableComponentLayout,
  KeyPressDetails,
  setKeyMap
} from './index';

const logo = require('../logo.png').default;

init({
  debug: true,
  visualDebug: false,
});

// const KEY_LEFT = 'left';
const KEY_RIGHT = 'right';
// const KEY_UP = 'up';
// const KEY_DOWN = 'down';
const KEY_BACK = 'back';
const KEY_SPACE = 'space';

const CUSTOM_KEY_MAP = {
  [KEY_BACK]: 8,
  [KEY_SPACE]: 32
};

setKeyMap(CUSTOM_KEY_MAP);

const rows = shuffle([
  {
    title: 'Recommended'
  },
  {
    title: 'Movies'
  },
  {
    title: 'Series'
  },
  {
    title: 'TV Channels'
  },
  {
    title: 'Sport'
  }
]);

const assets = [
  {
    title: 'Asset 1',
    color: '#714ADD'
  },
  {
    title: 'Asset 2',
    color: '#AB8DFF'
  },
  {
    title: 'Asset 3',
    color: '#512EB0'
  },
  {
    title: 'Asset 4',
    color: '#714ADD'
  },
  {
    title: 'Asset 5',
    color: '#AB8DFF'
  },
  {
    title: 'Asset 6',
    color: '#512EB0'
  },
  {
    title: 'Asset 7',
    color: '#714ADD'
  },
  {
    title: 'Asset 8',
    color: '#AB8DFF'
  },
  {
    title: 'Asset 9',
    color: '#512EB0'
  }
];

interface MenuItemBoxProps {
  focused: boolean;
}

const MenuItemBox = styled.div<MenuItemBoxProps>`
  width: 171px;
  height: 51px;
  background-color: #b056ed;
  border-color: white;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? '6px' : 0)};
  box-sizing: border-box;
  border-radius: 7px;
  margin-bottom: 37px;
`;

function MenuItem() {
  const { ref, focused } = useFocusable();

  return <MenuItemBox ref={ref} focused={focused} />;
}

interface MenuWrapperProps {
  hasFocusedChild: boolean;
}

const MenuWrapper = styled.div<MenuWrapperProps>`
  flex: 1;
  max-width: 246px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ hasFocusedChild }) =>
    hasFocusedChild ? '#4e4181' : '#362C56'};
  padding-top: 37px;
`;

const NmLogo = styled.img`
  height: 57px;
  width: 175px;
  margin-bottom: 51px;
`;

interface MenuProps {
  focusKey: string;
  onKeyPress: (props: {title: string}, details: KeyPressDetails) => boolean;
}

function Menu({ focusKey: focusKeyParam, onKeyPress}: MenuProps) {
  const {
    ref,
    focusSelf,
    hasFocusedChild,
    focusKey
    // setFocus, -- to set focus manually to some focusKey
    // navigateByDirection, -- to manually navigate by direction
    // pause, -- to pause all navigation events
    // resume, -- to resume all navigation events
    // updateAllLayouts, -- to force update all layouts when needed
    // getCurrentFocusKey -- to get the current focus key
  } = useFocusable({
    focusable: true,
    saveLastFocusedChild: false,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    focusKey: focusKeyParam,
    preferredChildFocusKey: null,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onArrowPress: () => true,
    onKeyPress,
    onFocus: () => {},
    onBlur: () => {},
    extraProps: { title: 'menu' }
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <MenuWrapper ref={ref} hasFocusedChild={hasFocusedChild}>
        <NmLogo src={logo} />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </MenuWrapper>
    </FocusContext.Provider>
  );
}

const AssetWrapper = styled.div`
  margin-right: 22px;
  display: flex;
  flex-direction: column;
`;

interface AssetBoxProps {
  focused: boolean;
  color: string;
}

const AssetBox = styled.div<AssetBoxProps>`
  width: 225px;
  height: 127px;
  background-color: ${({ color }) => color};
  border-color: white;
  border-style: solid;
  border-width: ${({ focused }) => (focused ? '6px' : 0)};
  box-sizing: border-box;
  border-radius: 7px;
`;

const AssetTitle = styled.div`
  color: white;
  margin-top: 10px;
  font-family: 'Segoe UI';
  font-size: 24px;
  font-weight: 400;
`;

interface AssetProps {
  title: string;
  color: string;
  onEnterPress: (props: object, details: KeyPressDetails) => void;
  onKeyPress: (props: {title: string, color: string}, details: KeyPressDetails) => boolean;
  onFocus: (
    layout: FocusableComponentLayout,
    props: object,
    details: FocusDetails
  ) => void;
}

function Asset({ title, color, onEnterPress, onKeyPress, onFocus }: AssetProps) {
  const { ref, focused } = useFocusable({
    onEnterPress,
    onKeyPress,
    onFocus,
    extraProps: {
      title,
      color
    }
  });

  return (
    <AssetWrapper ref={ref}>
      <AssetBox color={color} focused={focused} />
      <AssetTitle>{title}</AssetTitle>
    </AssetWrapper>
  );
}

const ContentRowWrapper = styled.div`
  margin-bottom: 37px;
`;

const ContentRowTitle = styled.div`
  color: white;
  margin-bottom: 22px;
  font-size: 27px;
  font-weight: 700;
  font-family: 'Segoe UI';
  padding-left: 60px;
`;

const ContentRowScrollingWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 1;
  flex-grow: 1;
  padding-left: 60px;
`;

const ContentRowScrollingContent = styled.div`
  display: flex;
  flex-direction: row;
`;

interface ContentRowProps {
  title: string;
  onAssetEnterPress: (props: object, details: KeyPressDetails) => void;
  onAssetKeyPress: (props: object, details: KeyPressDetails) => boolean;
  onKeyPress: (props: {title: string}, details: KeyPressDetails) => boolean;
  onFocus: (
    layout: FocusableComponentLayout,
    props: object,
    details: FocusDetails
  ) => void;
}

function ContentRow({
  title: rowTitle,
  onAssetEnterPress,
  onAssetKeyPress,
  onKeyPress,
  onFocus
}: ContentRowProps) {
  const { ref, focusKey } = useFocusable({
    onFocus,
    onKeyPress,
    extraProps: {
      title: rowTitle,
    },
  });

  const scrollingRef = useRef(null);

  const onAssetFocus = useCallback(
    ({ x }: { x: number }) => {
      scrollingRef.current.scrollTo({
        left: x,
        behavior: 'smooth'
      });
    },
    [scrollingRef]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentRowWrapper ref={ref}>
        <ContentRowTitle>{rowTitle}</ContentRowTitle>
        <ContentRowScrollingWrapper ref={scrollingRef}>
          <ContentRowScrollingContent>
            {assets.map(({ title, color }) => (
              <Asset
                key={title}
                title={title}
                color={color}
                onEnterPress={onAssetEnterPress}
                onKeyPress={onAssetKeyPress}
                onFocus={onAssetFocus}
              />
            ))}
          </ContentRowScrollingContent>
        </ContentRowScrollingWrapper>
      </ContentRowWrapper>
    </FocusContext.Provider>
  );
}

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentTitle = styled.div`
  color: white;
  font-size: 48px;
  font-weight: 600;
  font-family: 'Segoe UI';
  text-align: center;
  margin-top: 52px;
  margin-bottom: 37px;
`;

const SelectedItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectedItemBox = styled.div`
  height: 282px;
  width: 1074px;
  background-color: ${({ color }) => color};
  margin-bottom: 37px;
  border-radius: 7px;
`;

const SelectedItemTitle = styled.div`
  position: absolute;
  bottom: 75px;
  left: 100px;
  color: white;
  font-size: 27px;
  font-weight: 400;
  font-family: 'Segoe UI';
`;

const ScrollingRows = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 1;
  flex-grow: 1;
`;

interface ContentProps {
  focusKey: string;
  onAssetEnterPress: (props: object, details: KeyPressDetails) => void;
  onAssetKeyPress: (props: object, details: KeyPressDetails) => boolean;
  onContentRowKeyPress: (props: object, details: KeyPressDetails) => boolean;
  onKeyPress: (props: {title: string}, details: KeyPressDetails) => boolean;
  selectedAsset: AssetProps;
}

function Content({
  focusKey: focusKeyParam,
  onAssetEnterPress,
  onAssetKeyPress,
  onContentRowKeyPress,
  onKeyPress,
  selectedAsset,
}: ContentProps) {
  const { ref, focusKey } = useFocusable({ focusKey: focusKeyParam, onKeyPress, extraProps: { title: 'content' } });

  const onRowFocus = useCallback(
    ({ y }: { y: number }) => {
      ref.current.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    },
    [ref]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <ContentWrapper>
        <ContentTitle>Norigin Spatial Navigation+</ContentTitle>
        <SelectedItemWrapper>
          <SelectedItemBox
            color={selectedAsset ? selectedAsset.color : '#565b6b'}
          />
          <SelectedItemTitle>
            {selectedAsset
              ? selectedAsset.title
              : 'Press "Enter" to select an asset'}
          </SelectedItemTitle>
        </SelectedItemWrapper>
        <ScrollingRows ref={ref}>
          <div>
            {rows.map(({ title }) => (
              <ContentRow
                key={title}
                title={title}
                onAssetEnterPress={onAssetEnterPress}
                onAssetKeyPress={onAssetKeyPress}
                onFocus={onRowFocus}
                onKeyPress={onContentRowKeyPress}
              />
            ))}
          </div>
        </ScrollingRows>
      </ContentWrapper>
    </FocusContext.Provider>
  );
}

const Wrapper = styled.div`
background-color: #221c35;
width: 1440px;
height: 810px;
display: flex;
flex-direction: row;
`;

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    display: none;
  }
`;

function AppContainer() {
  const [selectedAsset, setSelectedAsset] = useState(null);

  const onAssetEnterPress = useCallback((asset: AssetProps) => {
    setSelectedAsset(asset);
  }, []);

  const onKeyPress = useCallback((obj: {title: string}, details: KeyPressDetails) => {
    switch(details.pressedKey) {
      case KEY_BACK:
        setSelectedAsset({
          color: '#4d8c57',
          title: `Pressed ${details.pressedKey} key on ${obj.title}`
        });
        return true;
      default:
        setSelectedAsset({
          color: '#f3b994',
          title: `Pressed ${details.pressedKey} key on ${obj.title}`
        });
        return true;
    }
  }, []);

  const onContentRowKeyPress = useCallback((row: ContentRowProps, details: KeyPressDetails) => {
    switch(details.pressedKey) {
      case KEY_BACK:
        setSelectedAsset({
          color: '#4d8c57',
          title: `Pressed ${details.pressedKey} key on ${row.title} row`,
        });
        return false;
      case KEY_RIGHT:
        if (!details.navigated) {
          setSelectedAsset({
            color: '#c4a484',
            title: `Pressed ${details.pressedKey} key on ${row.title} row`,
          });
          return true;
        }
        return true;
      /*
      case KEY_UP:
        if (!details.navigated) {
          setSelectedAsset({
            color: '#c4a484',
            title: `Pressed ${details.pressedKey} key on ${row.title} row`,
          });
          return true;
        }
        return true;
      case KEY_DOWN:
          if (!details.navigated) {
            setSelectedAsset({
              color: '#c4a484',
              title: `Pressed ${details.pressedKey} key on ${row.title} row`,
            });
            return true;
          }
          return false;
        */
      default:
        return false;
    }
  }, []);

  const onAssetKeyPress = useCallback((asset: AssetProps, details: KeyPressDetails) => {
    switch(details.pressedKey) {
      case KEY_BACK:
        setSelectedAsset({...asset, title: `Pressed ${details.pressedKey} key on ${asset.title}`});
        return false; // let back bubble to row
      default:
        return false;
    }
  }, []);

  return (
      <Wrapper>
        <GlobalStyle />
        <Menu focusKey="MENU" onKeyPress={onKeyPress} />
        <Content
          focusKey="CONTENT"
          onAssetEnterPress={onAssetEnterPress}
          onAssetKeyPress={onAssetKeyPress}
          onContentRowKeyPress={onContentRowKeyPress}
          onKeyPress={onKeyPress}
          selectedAsset={selectedAsset}
        />
      </Wrapper>
  )
}

function App() {
  return (
    <React.StrictMode>
      <AppContainer />
    </React.StrictMode>
  );
}

const root = ReactDOMClient.createRoot(document.querySelector('#root'));
root.render(<App />);
