import React from 'react'
import { findDOMNode } from 'react-dom'
import { Flex, Box } from 'reflexbox'
import Button from '@wombocompo/button'
import CoverEditor from '../lib'

import CSSModules from 'react-css-modules'
import style from './style'

import img from './images/cover_l.jpg'


@CSSModules(style)
export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      params: null,
    }
  }

  componentDidMount() {
    const params = JSON.parse(localStorage.getItem('cover-editor:params'))

    new CoverEditor(findDOMNode(this.refs.cover), {
      src: img,
      initialParams: params,
      navig: {
        scaleUp:    findDOMNode(this.refs.scaleUp),
        scaleDown:  findDOMNode(this.refs.scaleDown),
        save:       findDOMNode(this.refs.save),
      },
      onSave: this.save,
    })
  }
  
  save = (params) => {
    localStorage.setItem('cover-editor:params', JSON.stringify(params.initialParams))

    this.setState({
      params: JSON.stringify(params.initialParams, null, 4)
    })
  }
  
  cancel = () => {
    
  }

  
  render() {
    const { params } = this.state

    return (
      <div styleName="wrapper">
        <Flex>
          <Box mr={3}>
            <div styleName="container">
              <div styleName="scale">
                <div ref="scaleUp" styleName="scaleBtn">+</div>
                <div ref="scaleDown" styleName="scaleBtn">&ndash;</div>
              </div>

              <div styleName="navig">
                <Flex>
                  <Box>
                    <div ref="save">
                      <Button success h={30}>{'Save'}</Button>
                    </div>
                  </Box>
                </Flex>
              </div>

              <div ref="cover" styleName="cover" style={{ width: 600, height: 300 }}></div>
            </div>
          </Box>
          <Box>
            {
              params && (
                <div>
                  <div styleName="codeTitle">Params: </div>
                  <div styleName="code">{params}</div>
                </div>
              )
            }
          </Box>
        </Flex>
      </div>
    )
  }
}
