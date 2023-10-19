import { HStack } from '@chakra-ui/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

import { SkeletonLayout } from '../../../../../../components/layouts'
import { Body1 } from '../../../../../../components/typography'
import { ProjectViewBaseStats } from '../../../../../../types'
import { useCustomTheme } from '../../../../../../utils'
import { getColorByIndex } from '../helpers'

export const FundingRegionsPieChart = ({
  data,
  loading,
}: {
  data: ProjectViewBaseStats[]
  loading?: boolean
}) => {
  const { colors } = useCustomTheme()
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const renderLabel = ({ index, name, value, ...rest }: any) => {
    return (
      <text {...rest} fill={getColorByIndex(index)}>
        {`${name}: ${value}`}
      </text>
    )
  }

  return (
    <HStack ref={ref} w="full" spacing="20px" wrap="wrap">
      {loading ? (
        <SkeletonLayout width="full" height="250px" />
      ) : data.length === 0 ? (
        <Body1>{t('No data available')}</Body1>
      ) : (
        <PieChart width={ref.current?.clientWidth || 350} height={250}>
          <Pie
            data={data}
            dataKey="viewCount"
            nameKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            label={renderLabel}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getColorByIndex(index)} />
            ))}
          </Pie>
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: colors.neutral[0],
              borderColor: colors.neutral[200],
              borderRadius: '8px',
            }}
            itemStyle={{ color: colors.neutral[900] }}
          />
        </PieChart>
      )}
    </HStack>
  )
}