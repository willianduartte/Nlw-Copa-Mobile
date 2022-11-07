import { VStack, Icon, useToast, FlatList } from "native-base"
import { Button } from "../components/Button"
import { Header } from "../components/Header"
import { Octicons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { api } from "../services/api"
import { useCallback, useState } from "react"
import { Loading } from "../components/Loading"
import { PoolCard, PoolPros } from "../components/PoolCard"
import { EmptyPoolList } from "../components/EmptyPoolList"

export const Pools = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState<PoolPros[]>([])

  const { navigate } = useNavigation()
  const toast = useToast()

  const fetchPools = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/pools')
      setPools(response.data.pools)
      
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools()
  }, []))

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header
        title="Meus bolões"
      />
      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray-600' pb={4} mb={4} >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name='search' color='black' size='md' />}
          onPress={() => navigate('find')}
        />
      </VStack>

      {
        isLoading? <Loading/> : 
          <FlatList
          data={pools}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PoolCard 
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          ListEmptyComponent={() => <EmptyPoolList />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      }
    </VStack>
  )
}