// import React from 'react'
import PropTypes from 'prop-types'
import { content } from './Content.module.css'

// Componente para el contenido principal
const Content = ({ selectedMenuItem, children }) => {
  return (
    <div className={content}>
      <h1>{selectedMenuItem}</h1>
      {children}
    </div>
  )
}

Content.propTypes = {
  selectedMenuItem: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}
  

export default Content