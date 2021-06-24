import React, { Fragment, useCallback, useEffect } from 'react'
import {
  Layout,
  Form,
  InputNumber,
  Row,
  Col,
  BackTop,
  Card,
  Avatar,
  Tooltip,
  Switch,
  Select,
  Button,
  Slider,
} from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'

/* component */
import ArcaneInputRangeSync from '../src/component/arcane-input-range-sync'
import ResultTable from '../src/component/result-table'
import StatisticBoard from '../src/component/statistic-board'
import GoogleAD from '../src/component/google-ad'

/* mapping */
import ArcZone from '../src/mapping/arcane-river-zone'

/* helper */
import { withTranslation } from '../src/i18n'
import arcMatching from '../src/util/arc-match'
import { eqBy, path, not, is, add } from 'ramda'

import styles from '../styles/Home.module.css'

import { debounce } from 'throttle-debounce'

const { Header, Content, Footer } = Layout

const initialValues = {
  role: 0,
  vanishingjourney: {},
  chuchu: {},
  lachelein: {},
  arcana: {},
  morass: {},
  esfera: {},
}

const storageKey = 'MAPLESTORE_ARCANE_SYMBOL_CALCULATOR_DATA'

const fieldShouldUpdate = (selector) => (prev, curr) =>
  is(Array, selector)
    ? selector.some((s) => not(eqBy(path(s), prev, curr)))
    : not(eqBy(path(selector), prev, curr))

function Home({ t, i18n }) {
  const [form] = Form.useForm()
  // const { initialData, handleSaveToStorage } = useMemo(useLocalStorage, [])
  const handleSaveToStorage = useCallback(
    debounce(1000, (_, AllData) => {
      process.browser &&
        window.localStorage.setItem(storageKey, JSON.stringify(AllData))
    }),
    []
  )
  useEffect(() => {
    if (process.browser) {
      form.setFieldsValue(
        JSON.parse(window.localStorage.getItem(storageKey)) || initialValues
      )
    }
  }, [])
  return (
    <Layout className="layout">
      <Header className={styles.header}>
        <div className={styles['header-container']}>
          <h2 style={{ marginBottom: 0 }}>
            {t('title')}
            &nbsp;
          </h2>
          <div style={{ marginLeft: 'auto', marginRight: '4rem' }}>
            <Button
              onClick={() => {
                form.resetFields()
                handleSaveToStorage({}, initialValues)
              }}
              style={{ marginRight: '.5rem' }}
            >
              {t('reset')}
            </Button>
            <Select
              onChange={(value) =>
                i18n.changeLanguage && i18n.changeLanguage(value)
              }
              defaultValue={i18n.language}
            >
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="zh_tw">繁體中文</Select.Option>
              <Select.Option value="zh_cn">简体中文</Select.Option>
            </Select>
          </div>
        </div>
      </Header>
      <BackTop />
      <Content className={styles.content}>
        <Form
          form={form}
          initialValues={initialValues}
          onValuesChange={handleSaveToStorage}
          colon={false}
        >
          <Row gutter={[8, 8]}>
            {ArcZone.map(({ name, extraRegion, key, daily, pquest }) => (
              <Col key={key} span={24} md={12} xl={8}>
                <Card title={t(name)}>
                  <Row gutter={[0, 12]}>
                    <Col span={24}>
                      <Form.Item
                        name={[key, 'count']}
                        style={{ marginBottom: 0 }}
                      >
                        <ArcaneInputRangeSync name={key} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Row>
                        <Col flex="none">
                          <Tooltip
                            title={t('extra_symbol')}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Form.Item
                              name={[key, 'extra']}
                              label={
                                <Avatar
                                  src="/selectable.png"
                                  alt={t('alt_extra')}
                                  style={{ cursor: 'pointer' }}
                                />
                              }
                              style={{
                                display: 'inline-flex',
                                marginBottom: 0,
                              }}
                            >
                              <InputNumber
                                min={0}
                                defaultValue={0}
                                precision={0}
                              />
                            </Form.Item>
                            <Form.Item
                              shouldUpdate={fieldShouldUpdate([
                                [key, 'count'],
                                [key, 'extra'],
                              ])}
                              noStyle
                            >
                              {({ getFieldValue }) => {
                                const areaData = getFieldValue(key)
                                const total =
                                  areaData.count + (areaData.extra || 0)
                                return areaData.extra ? (
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      paddingTop: 4,
                                    }}
                                  >
                                    <ArrowRightOutlined
                                      style={{ margin: '0 4px' }}
                                    />
                                    {`Lv.${arcMatching(total).level} / ` +
                                      `${total - arcMatching(total).stack}`}
                                  </span>
                                ) : null
                              }}
                            </Form.Item>
                          </Tooltip>
                        </Col>
                        <Col xs={24} sm={5} style={{ marginLeft: 'auto' }}>
                          <Form.Item
                            shouldUpdate={fieldShouldUpdate([
                              [key, 'count'],
                              [key, 'extra'],
                            ])}
                            noStyle
                          >
                            {({ getFieldValue, setFieldsValue }) => {
                              const areaData = getFieldValue(key)
                              const total =
                                areaData.count + (areaData.extra || 0)
                              return (
                                <Button
                                  type="primary"
                                  block
                                  onClick={() => {
                                    setFieldsValue({
                                      [key]: {
                                        ...areaData,
                                        count: total,
                                        extra: 0,
                                      },
                                    })
                                  }}
                                  disabled={!areaData.extra}
                                >
                                  {t('extra_symbol_add')}
                                </Button>
                              )
                            }}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <h4>{t('daily_symbol_source')}:</h4>
                    </Col>
                    <Col span={12}>
                      <Tooltip
                        title={
                          t('daily_quest_tips', { count: daily[0] || daily }) +
                          (extraRegion
                            ? t('daily_quest_tips_extra', {
                                region: t(extraRegion),
                                count: daily[0],
                              })
                            : '')
                        }
                      >
                        <Form.Item
                          name={[key, 'quest']}
                          label={
                            <Avatar
                              shape="square"
                              src="/daily.png"
                              alt={t('alt_daily', { name: t(name) })}
                              style={{ cursor: 'pointer' }}
                            />
                          }
                          style={{
                            display: 'flex',
                            marginBottom: 0,
                            paddingRight: 8,
                          }}
                          valuePropName="checked"
                        >
                          {extraRegion ? (
                            <Slider
                              step={daily[0]}
                              marks={{
                                0: 0,
                                1: daily[0],
                                2: daily[1],
                              }}
                              min={0}
                              max={daily.length}
                              tooltipVisible={false}
                            />
                          ) : (
                            <Switch
                              checkedChildren={daily}
                              unCheckedChildren="0"
                            />
                          )}
                        </Form.Item>
                      </Tooltip>
                    </Col>
                    {pquest && (
                      <Col span={12}>
                        <Tooltip
                          title={
                            pquest.desc
                              ? t(pquest.desc, {
                                  ...pquest,
                                  name: t(pquest.name),
                                })
                              : t('party_quest_tips', {
                                  name: t(pquest.name),
                                  count: pquest.count || pquest.dailyMax,
                                }) +
                                (pquest.unit
                                  ? t('party_quest_tips_exchange', pquest)
                                  : '')
                          }
                        >
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Form.Item
                              name={[key, 'party']}
                              label={
                                pquest.type === 'symbol' ? (
                                  <div style={{ cursor: 'pointer' }}>
                                    {t('party_quest')}
                                  </div>
                                ) : (
                                  <Avatar
                                    src={`/${key}-coin.png`}
                                    alt={t('alt_coin', {
                                      name: t(pquest.name),
                                    })}
                                    style={{ cursor: 'pointer' }}
                                  />
                                )
                              }
                              style={{
                                display: 'inline-flex',
                                marginBottom: 0,
                              }}
                              valuePropName={pquest.count ? 'checked' : 'value'}
                            >
                              {/* if party quest has static value, use swtich button */}
                              {pquest.count ? (
                                <Switch
                                  checkedChildren={pquest.count}
                                  unCheckedChildren="0"
                                />
                              ) : (
                                <InputNumber
                                  min={0}
                                  max={pquest.dailyMax}
                                  defaultValue={0}
                                  style={{ width: 70 }}
                                  precision={0}
                                />
                              )}
                            </Form.Item>
                            {pquest.unit && (
                              <span>&nbsp;/&nbsp;{pquest.unit}</span>
                            )}
                          </div>
                        </Tooltip>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
          <Form.Item shouldUpdate wrapperCol={{ xs: 24, sm: 24 }}>
            {({ getFieldsValue }) => {
              const fieldsValue = getFieldsValue()
              const data = Object.keys(fieldsValue).length
                ? fieldsValue
                : initialValues
              return (
                <Fragment>
                  <StatisticBoard data={data} />
                  <ResultTable data={data} />
                </Fragment>
              )
            }}
          </Form.Item>
        </Form>
        <div className={styles.info}>
          <div className={styles['info-text']}>
            {t('just_a_advertisement')}(´・ω・`)
          </div>
          <GoogleAD />
        </div>
      </Content>
      <Footer className={styles.footer}>
        <div>
          {t('other_tools')}：
          <a href="https://maplesalon.vercel.app">{t('web_maplesalon')}</a>、
          <a href="https://maplestory-boss-crystal-calculator.vercel.app">
            {t('web_boss_crystal_calculator')}
          </a>
        </div>
        {t('title')} ©2020 Created by 丫村
      </Footer>
    </Layout>
  )
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['index'],
})

export default withTranslation('index')(Home)
