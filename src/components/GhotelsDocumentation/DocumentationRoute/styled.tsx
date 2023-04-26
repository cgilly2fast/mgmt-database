import styled from 'styled-components';

export const Outletdiv = styled.div`
  padding-top: 50px;
  padding-left: 20%;
  padding-right: 50px;
  height: 850px;
  overflow-y: scroll;
  @media (max-width: 1440px) {
    padding-left: 25%;
  }
  @media (max-width: 1024px) {
    padding-left: 35%;
  }
  ::-webkit-scrollbar {
    display: none !important;
  }
`;
