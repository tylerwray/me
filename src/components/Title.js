import styled from "styled-components"
import { Link } from "gatsby"

const Title = styled(Link)`
  font-size: 32px;
  line-height: 40px;
  color: var(--cream);
  text-decoration: none;
  font-family: Satisfy;
  z-index: var(--index-level-3);
  -webkit-tap-highlight-color: transparent;
`

export default Title
