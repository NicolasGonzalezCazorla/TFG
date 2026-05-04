import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { homeStyles as s } from './index.styles';

import ExperienceCard from '../components/ExperienceCard';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import Badge from '../components/Badge';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import NavBar from '../components/NavBar';
import Footer from '../components/footer';

import { API_URL } from '../constants';

type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
};

type Experience = {
  id: string;
  title: string;
  description: string;
  image: { uri: string };
};

const EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'Facial Glow',
    description: 'Luz, hidratación y tontura activa',
    image: { uri: 'https://picsum.photos/seed/facial1/400/300' },
  },
  {
    id: '2',
    title: 'Masaje Relajante',
    description: 'Descanso profundo con nuestros productos',
    image: { uri: 'https://picsum.photos/seed/massage2/400/300' },
  },
  {
    id: '3',
    title: 'Ritual Imperial',
    description: 'Equilibrio y vitalidad integral',
    image: { uri: 'https://picsum.photos/seed/ritual3/400/300' },
  },
];

const CATEGORIES = ['CAT 1', 'CAT 2', 'CAT 3', 'CAT 4'];

const PRODUCTS_FALLBACK: Product[] = [
  { id: '1', name: 'Producto 1', price: '25', description: 'Descripcion del producto breve.' },
  { id: '2', name: 'Producto 2', price: '34', description: 'Descripcion del producto breve.' },
  { id: '3', name: 'Producto 3', price: '27', description: 'Descripcion del producto breve.' },
  { id: '4', name: 'Producto 4', price: '29', description: 'Descripcion del producto breve.' },
  { id: '5', name: 'Producto 5', price: '40', description: 'Descripcion del producto breve.' },
  { id: '6', name: 'Producto 6', price: '22', description: 'Descripcion del producto breve.' },
];

const PRODUCT_IMAGE = { uri: 'https://picsum.photos/seed/lipstick/300/300' };
const SALON_IMAGE   = { uri: 'https://picsum.photos/seed/salon/700/500' };
const BREAKPOINT    = 768;

export default function Home() {
  const { width } = useWindowDimensions();
  const isDesktop  = width >= BREAKPOINT;
  const router     = useRouter();

  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeCategory, setActiveCategory] = useState('CAT 1');
  const [productos,      setProductos]      = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then(res => res.json())
      .then(data => {
        if (data.productos && data.productos.length > 0) {
          // Muestra solo los primeros 6 en el home
          const primeros6 = data.productos.slice(0, 6).map((p: any) => ({
            id:          p.id,
            name:        p.nombre,
            price:       String(p.precio),
            description: p.descripcion,
          }));
          setProductos(primeros6);
        } else {
          setProductos(PRODUCTS_FALLBACK);
        }
      })
      .catch(() => setProductos(PRODUCTS_FALLBACK));
  }, []);

  const renderHero = () => {
    if (isDesktop) {
      return (
        <View style={s.heroBanner}>
          <View style={s.heroLeft}>
            <Text style={s.heroEyebrow}>{'Bienvenidos'}</Text>
            <Text style={s.heroTitle}>{'ESTÉTICA\nALICIA'}</Text>
            <Text style={s.heroSubtitle}>
              {'Tratamientos holistos y minerales con Ohlalá products.\nReserva tu cita en segundos y disfruta una experiencia única.'}
            </Text>
            <Button
              label="RESERVA TU CITA"
              variant="primary"
              onPress={() => router.push('/reserva')}
            />
          </View>
          <View style={s.heroRight}>
            <Image source={SALON_IMAGE} style={s.heroImage} resizeMode="cover" />
          </View>
        </View>
      );
    }
    return (
      <View style={s.heroMobile}>
        <Image source={SALON_IMAGE} style={s.heroImageMobile} resizeMode="cover" />
        <View style={s.heroMobileContent}>
          <Button
            label="RESERVAR CITA"
            variant="primary"
            fullWidth
            onPress={() => router.push('/reserva')}
          />
        </View>
      </View>
    );
  };

  const renderExperiences = () => (
    <View style={[s.section, { backgroundColor: '#FFFFFF' }]}>
      <SectionHeader
        title="Descubre nuestras experiencias"
        subtitle={
          isDesktop
            ? 'Rituales diseñados para hacer tu Ohlalá real un ACABADO PICADO'
            : 'Elige una de nuestras experiencias y reserva tu cita.'
        }
      />
      {isDesktop ? (
        <View style={s.experienceGrid}>
          {EXPERIENCES.map((exp) => (
            <ExperienceCard
              key={exp.id}
              image={exp.image}
              title={exp.title}
              description={exp.description}
              isDesktop
              onPress={() =>
                router.push({
                  pathname: '/experiencia/[id]',
                  params: {
                    id:          exp.id,
                    title:       exp.title,
                    description: exp.description,
                    image:       exp.image.uri,
                  },
                })
              }
            />
          ))}
        </View>
      ) : (
        <View style={s.experienceList}>
          {EXPERIENCES.map((exp) => (
            <ExperienceCard
              key={exp.id}
              image={exp.image}
              title={exp.title}
              description={exp.description}
              isDesktop={false}
              onPress={() =>
                router.push({
                  pathname: '/experiencia/[id]',
                  params: {
                    id:          exp.id,
                    title:       exp.title,
                    description: exp.description,
                    image:       exp.image.uri,
                  },
                })
              }
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderProducts = () => {
    const numColumns = isDesktop ? 3 : 2;
    const rows: Product[][] = [];
    for (let i = 0; i < productos.length; i += numColumns) {
      rows.push(productos.slice(i, i + numColumns));
    }

    return (
      <View style={[s.section, { backgroundColor: '#F9F8F4' }]}>
        <View style={s.productBanner}>
          <Text style={s.productBannerTitle}>
            {'NUESTROS PRODUCTOS\nEN TIENDA'}
          </Text>
          <Text style={s.productBannerSub}>
            {'Consulta todos los elementos · Tipo suplementos · Recomendaciones propias'}
          </Text>
        </View>

        {!isDesktop && (
          <View style={s.mobileFilters}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.categoriesRow}
            >
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onPress={() => setActiveCategory(cat)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={s.productGrid}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={s.productRow}>
              {row.map((product) => (
                <ProductCard
                  key={product.id}
                  image={PRODUCT_IMAGE}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  onPress={() =>
                    router.push({
                      pathname: '/producto/[id]',
                      params: {
                        id:          product.id,
                        name:        product.name,
                        price:       product.price,
                        description: product.description,
                      },
                    })
                  }
                />
              ))}
              {row.length < numColumns &&
                Array(numColumns - row.length)
                  .fill(null)
                  .map((_, i) => (
                    <View key={`empty-${i}`} style={{ flex: 1, margin: 6 }} />
                  ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={s.screen}>
      <NavBar />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[
          s.scrollContent,
          isDesktop && s.scrollContentDesktop,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.container, isDesktop && s.containerDesktop]}>
          {renderHero()}
          {renderExperiences()}
          {renderProducts()}
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}