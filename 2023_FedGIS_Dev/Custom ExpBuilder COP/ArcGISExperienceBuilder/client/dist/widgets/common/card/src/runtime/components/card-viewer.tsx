/** @jsx jsx */
import {
  jsx,
  AppMode,
  React,
  DataRecord,
  LinkTo,
  LinkResult,
  classNames,
  AnimationContext,
  ImmutableObject,
  UrlParameters,
  LinkType,
  TransitionContainer,
  getNextAnimationId
} from 'jimu-core'
import { styleUtils, _Link as Link, LinkTarget } from 'jimu-ui'
import { LayoutEntry } from 'jimu-layouts/layout-runtime'
import { Status } from '../../config'
import Card, { CardProps, CardStates } from './card-base'
import { IMLinkParam } from 'jimu-ui/advanced/setting-components'

interface ListCardViewerProps extends CardProps {
  /**
   * one or more expressions
   */
  linkParam?: IMLinkParam
  queryObject: ImmutableObject<UrlParameters>
}

interface ListCardViewerStates extends CardStates {
  url: string
  isHover: boolean
  previousIndex: number
  currentIndex: number
  regularPlayId: number
  hoverPlayId: number
}

export default class CardViewer extends Card<
ListCardViewerProps,
ListCardViewerStates
> {
  regularLayoutRef: any
  hoverLayoutRef: any
  linkRef: React.RefObject<HTMLButtonElement>
  expressionRecords: { [key: string]: DataRecord }
  didMount: boolean
  constructor (props) {
    super(props)

    this.state = {
      url: '',
      isHover: false,
      previousIndex: 1,
      currentIndex: 0,
      regularPlayId: null,
      hoverPlayId: null
    }

    this.regularLayoutRef = React.createRef()
    this.hoverLayoutRef = React.createRef()
    this.linkRef = React.createRef<HTMLButtonElement>()
    this.didMount = false
  }

  componentDidMount () {
    this.didMount = true
  }

  componentDidUpdate (prveProps) {
    const oldCardConfig = this.props.cardConfigs
    const { cardConfigs } = prveProps
    const isPreviewIdChange =
      oldCardConfig?.transitionInfo?.previewId ===
      cardConfigs?.transitionInfo?.previewId
    if (!isPreviewIdChange) {
      this.setState({
        hoverPlayId: getNextAnimationId(),
        regularPlayId: getNextAnimationId()
      })
    }
  }

  handleItemClick = evt => {
    const { linkRef } = this

    const tagName = (evt.target && evt.target.tagName) || ''
    if (
      !(
        tagName.toLowerCase() === 'a' ||
        tagName.toLowerCase() === 'button' ||
        evt.exbEventType === 'linkClick'
      )
    ) {
      if (linkRef.current) {
        // Must stopPropagation from link click, or this method will be called twice.
        linkRef.current.click()
      }
    }

    if (evt.exbEventType === 'linkClick') {
      delete evt.exbEventType
    }
  }

  onMouse = (evt, isHover = false) => {
    const { cardConfigs } = this.props
    const isHoverEnable = cardConfigs?.HOVER?.enable
    let { previousIndex, currentIndex, hoverPlayId, regularPlayId } = this.state
    if (isHoverEnable) {
      previousIndex = isHover ? 0 : 1
      currentIndex = isHover ? 1 : 0
      hoverPlayId = isHover ? getNextAnimationId() : null
      regularPlayId = isHover ? null : getNextAnimationId()
    }
    this.setState({
      isHover: isHover,
      previousIndex: previousIndex,
      currentIndex: currentIndex,
      hoverPlayId: hoverPlayId,
      regularPlayId: regularPlayId
    })
  }

  getCardContent = () => {
    const { cardConfigs, layouts, appMode, linkParam, browserSizeMode } = this.props
    let { queryObject } = this.props
    const { hoverPlayId, regularPlayId } = this.state
    const transitionInfo = cardConfigs?.transitionInfo

    const isHoverEnable = cardConfigs?.HOVER?.enable
    const isInBuilder = window.jimuConfig.isInBuilder
    const cardContent = []
    let regularLayout, regularBgStyle, hoverLayout, hoverBgStyle
    let target: LinkTarget
    let linkTo: LinkTo
    if (isInBuilder && appMode !== AppMode.Run) {
      regularBgStyle = this.getBackgroundStyle(Status.Regular)
      regularLayout = layouts[Status.Regular]
      if (isHoverEnable) {
        hoverBgStyle = this.getBackgroundStyle(Status.Hover)
        hoverLayout = layouts[Status.Hover]
      }
    } else {
      regularLayout = layouts[Status.Regular]
      regularBgStyle = this.getBackgroundStyle(Status.Regular)
      if (linkParam && linkParam.linkType) {
        target = linkParam.openType
        linkTo = {
          linkType: linkParam.linkType
        } as LinkResult

        if (linkParam.linkType === LinkType.WebAddress) {
          linkTo.value = linkParam?.value || ''
          queryObject = undefined
        } else {
          linkTo.value = linkParam.value
        }
      }
      if (isHoverEnable) {
        hoverLayout = layouts[Status.Hover]
        hoverBgStyle = this.getBackgroundStyle(Status.Hover)
      }
    }

    const mergedStyle: any = {
      ...styleUtils.toCSSStyle(regularBgStyle || ({} as any))
    }
    const isShowLink =
      linkParam?.linkType && linkParam?.linkType !== LinkType.None
    const regularElement = (
      <div
        className={classNames(
          'card-content d-flex surface-1',
          isShowLink ? 'card-link' : ''
        )}
        key={Status.Regular}
      >
        <div className='w-100 animation-list' style={mergedStyle}>
          <Link
            className='p-0 w-100 h-100 border-0 clear-background card-link'
            ref={this.linkRef}
            to={linkTo}
            target={target}
            queryObject={queryObject}
          />
          <div className='d-flex w-100 h-100' ref={this.regularLayoutRef}>
            <AnimationContext.Provider
              value={{
                setting: transitionInfo?.oneByOneEffect || null,
                playId: regularPlayId,
                oid: regularLayout?.[browserSizeMode]
              }}
            >
              <LayoutEntry layouts={regularLayout} />
            </AnimationContext.Provider>
          </div>
        </div>
      </div>
    )
    cardContent.push(regularElement)

    if (isHoverEnable) {
      const hoverMergedStyle: any = {
        ...styleUtils.toCSSStyle(hoverBgStyle || ({} as any))
      }
      const hoverElement = (
        <div
          className={classNames(
            'card-content d-flex surface-1',
            isShowLink ? 'card-link' : ''
          )}
          key={Status.Hover}
        >
          <div className='w-100 animation-list' style={hoverMergedStyle}>
            <Link
              className='p-0 w-100 h-100 border-0 clear-background card-link'
              ref={this.linkRef}
              to={linkTo}
              target={target}
              queryObject={queryObject}
            />
            <div className='d-flex w-100 h-100' ref={this.hoverLayoutRef}>
              <AnimationContext.Provider
                value={{
                  setting: transitionInfo?.oneByOneEffect || null,
                  playId: hoverPlayId,
                  oid: hoverLayout[browserSizeMode]
                }}
              >
                <LayoutEntry layouts={hoverLayout} />
              </AnimationContext.Provider>
            </div>
          </div>
        </div>
      )
      cardContent.push(hoverElement)
    }

    return cardContent
  }

  getBackgroundStyle = (status: Status) => {
    const { cardConfigs } = this.props
    const backgroundStyle = cardConfigs[status].backgroundStyle
    if (backgroundStyle?.boxShadow) {
      return backgroundStyle.setIn(['boxShadow', 'color'], 'transparent')
    } else {
      return backgroundStyle
    }
  }

  getCardShadowStyle = () => {
    const { cardConfigs } = this.props
    const { isHover } = this.state
    const isShowHoverBoxShadow = isHover && cardConfigs[Status.Hover].enable
    const status = isShowHoverBoxShadow ? Status.Hover : Status.Regular
    const style = {
      boxShadow: cardConfigs[status].backgroundStyle?.boxShadow,
      borderRadius: cardConfigs[status].backgroundStyle?.borderRadius
    }

    const cardShadowStyle: any = {
      ...styleUtils.toCSSStyle(style as any)
    }
    return cardShadowStyle
  }

  render () {
    const { widgetId, cardConfigs } = this.props
    const { previousIndex, currentIndex } = this.state
    const transitionInfo = cardConfigs.transitionInfo
    const cardViewerClass = `card-${widgetId}`
    const previewId = transitionInfo?.previewId || null
    const status = currentIndex === 0 ? Status.Regular : Status.Hover
    return (
      <div
        css={this.getStyle(status)}
        style={this.getCardShadowStyle()}
        className={cardViewerClass}
        onMouseLeave={e => {
          this.onMouse(e, false)
        }}
        onMouseEnter={e => {
          this.onMouse(e, true)
        }}
        onClick={this.handleItemClick}
      >
        <TransitionContainer
          previousIndex={previousIndex}
          currentIndex={currentIndex}
          transitionType={transitionInfo?.transition?.type}
          direction={transitionInfo?.transition?.direction}
          playId={this.didMount ? previewId : null}
          withOneByOne={!!transitionInfo?.oneByOneEffect}
        >
          {this.getCardContent()}
        </TransitionContainer>
      </div>
    )
  }
}
